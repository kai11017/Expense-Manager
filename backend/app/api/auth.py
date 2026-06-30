from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, OTP
from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut, OTPRequest, OTPVerify, PasswordReset, GoogleLogin, FirebaseLogin
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user
import random
import datetime
from google.oauth2 import id_token
from google.auth.transport import requests

router = APIRouter(prefix="/auth", tags=["auth"])

GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID" # Placeholder for Google Client ID

def generate_otp():
    return str(random.randint(100000, 999999))

@router.post("/request-otp", status_code=status.HTTP_200_OK)
def request_otp(payload: OTPRequest, db: Session = Depends(get_db)):
    if payload.type == "signup":
        user = db.query(User).filter(User.email == payload.email).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
    elif payload.type == "reset":
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
    otp_code = generate_otp()
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    new_otp = OTP(
        email=payload.email,
        otp_code=otp_code,
        type=payload.type,
        expires_at=expires_at
    )
    db.add(new_otp)
    db.commit()
    
    # In a real app, send email here. For now, we print to console.
    print(f"\n\n====== OTP REQUEST ======\nEmail: {payload.email}\nType: {payload.type}\nOTP Code: {otp_code}\n=========================\n\n")
    
    return {"message": "OTP sent successfully", "dev_otp": otp_code}

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    # 1. Verify OTP
    otp_record = db.query(OTP).filter(
        OTP.email == user_in.email,
        OTP.otp_code == user_in.otp_code,
        OTP.type == "signup",
        OTP.is_used == False,
        OTP.expires_at > datetime.datetime.utcnow()
    ).order_by(OTP.id.desc()).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    db_user = db.query(User).filter(User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    hashed_pwd = hash_password(user_in.password)
    new_user = User(
        email=user_in.email,
        name=user_in.name,
        hashed_password=hashed_pwd,
        auth_provider="local"
    )
    db.add(new_user)
    
    otp_record.is_used = True
    db.add(otp_record)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: PasswordReset, db: Session = Depends(get_db)):
    otp_record = db.query(OTP).filter(
        OTP.email == payload.email,
        OTP.otp_code == payload.otp_code,
        OTP.type == "reset",
        OTP.is_used == False,
        OTP.expires_at > datetime.datetime.utcnow()
    ).order_by(OTP.id.desc()).first()
    
    if not otp_record:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = hash_password(payload.new_password)
    db.add(user)
    
    otp_record.is_used = True
    db.add(otp_record)
    
    db.commit()
    return {"message": "Password reset successfully"}

@router.post("/login", response_model=Token)
def login(user_in: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_in.email).first()
    if not user or not user.hashed_password or not verify_password(user_in.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect email or password"
        )
    token_data = {"email": user.email, "id": user.id}
    token = create_access_token(token_data)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "name": user.name,
        "has_completed_tour": user.has_completed_tour
    }

@router.post("/google", response_model=Token)
def google_login(payload: GoogleLogin, db: Session = Depends(get_db)):
    try:
        # Note: We use requests.Request() directly here to verify
        # To make it work in dev without setting up a real Client ID, you can skip audience validation 
        # but in production you MUST specify audience=GOOGLE_CLIENT_ID
        idinfo = id_token.verify_oauth2_token(payload.token, requests.Request())
        
        email = idinfo.get("email")
        name = idinfo.get("name")
        
        if not email:
            raise HTTPException(status_code=400, detail="Google token missing email")
            
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create user if doesn't exist
            user = User(
                email=email,
                name=name,
                auth_provider="google"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token_data = {"email": user.email, "id": user.id}
        token = create_access_token(token_data)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "has_completed_tour": user.has_completed_tour
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Google token: {str(e)}")

@router.post("/firebase", response_model=Token)
def firebase_login(payload: FirebaseLogin, db: Session = Depends(get_db)):
    try:
        # Verify the Firebase ID token using google-auth library
        # The audience is the Firebase Project ID
        idinfo = id_token.verify_firebase_token(payload.token, requests.Request(), audience="expense-manager-4d508")
        
        email = idinfo.get("email")
        name = idinfo.get("name") or (email.split("@")[0] if email else "User")
        
        if not email:
            raise HTTPException(status_code=400, detail="Firebase token missing email")
            
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            # Create user if doesn't exist (automatic registration)
            user = User(
                email=email,
                name=name,
                auth_provider="firebase"
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            
        token_data = {"email": user.email, "id": user.id}
        token = create_access_token(token_data)
        
        return {
            "access_token": token,
            "token_type": "bearer",
            "user_id": user.id,
            "email": user.email,
            "name": user.name,
            "has_completed_tour": user.has_completed_tour
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid Firebase token: {str(e)}")

@router.post("/complete-tour", status_code=status.HTTP_200_OK)
def complete_tour(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    current_user.has_completed_tour = True
    db.add(current_user)
    db.commit()
    return {"message": "Tour marked as completed"}
