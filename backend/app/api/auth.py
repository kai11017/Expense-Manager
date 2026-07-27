from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import User, OTP
from app.schemas.schemas import UserCreate, UserLogin, Token, UserOut, OTPRequest, OTPVerify, PasswordReset, GoogleLogin, FirebaseLogin
from app.auth.security import hash_password, verify_password, create_access_token
from app.auth.dependencies import get_current_user
from app.core.redis_client import redis_cache
from app.tasks import send_otp_email_task
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
    if not redis_cache.is_connected:
        raise HTTPException(status_code=503, detail="OTP service is currently unavailable. Please try again later.")

    if payload.type == "signup":
        user = db.query(User).filter(User.email == payload.email).first()
        if user:
            raise HTTPException(status_code=400, detail="Email already registered")
    elif payload.type == "reset":
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
            
    otp_code = generate_otp()
    redis_key = f"otp:{payload.type}:{payload.email}"
    
    # Store in Redis with 10 minute (600 seconds) expiration
    success = redis_cache.set(redis_key, otp_code, ttl_seconds=600)
    
    if not success:
        raise HTTPException(status_code=503, detail="Failed to generate OTP")
        
    # Dispatch email sending to Celery worker in the background
    send_otp_email_task.delay(payload.email, otp_code, payload.type)
    
    return {"message": "OTP sent successfully", "dev_otp": otp_code}

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    if not redis_cache.is_connected:
        raise HTTPException(status_code=503, detail="Registration service is currently unavailable.")

    # 1. Verify OTP from Redis
    redis_key = f"otp:signup:{user_in.email}"
    stored_otp = redis_cache.get(redis_key)
    
    if not stored_otp or stored_otp != user_in.otp_code:
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
    
    # Invalidate OTP to prevent reuse
    redis_cache.delete(redis_key)
    
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/reset-password", status_code=status.HTTP_200_OK)
def reset_password(payload: PasswordReset, db: Session = Depends(get_db)):
    if not redis_cache.is_connected:
        raise HTTPException(status_code=503, detail="Password reset service is currently unavailable.")

    redis_key = f"otp:reset:{payload.email}"
    stored_otp = redis_cache.get(redis_key)
    
    if not stored_otp or stored_otp != payload.otp_code:
        raise HTTPException(status_code=400, detail="Invalid or expired OTP")
        
    user = db.query(User).filter(User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    user.hashed_password = hash_password(payload.new_password)
    db.add(user)
    
    # Invalidate OTP
    redis_cache.delete(redis_key)
    
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
        
        uid = idinfo.get("user_id") or idinfo.get("sub")
        email = idinfo.get("email")
        name = idinfo.get("name") or (email.split("@")[0] if email else "Guest User")
        
        if not uid:
            raise HTTPException(status_code=400, detail="Firebase token missing uid")
            
        user = db.query(User).filter(User.firebase_uid == uid).first()
        
        if user:
            # Account linking: Update guest email to real email if provided
            if email and user.email.startswith("guest_") and email != user.email:
                # Check if email is already used by another account
                existing_email_user = db.query(User).filter(User.email == email, User.id != user.id).first()
                if existing_email_user:
                     raise HTTPException(status_code=400, detail="Email already linked to another account.")
                user.email = email
                if idinfo.get("name"):
                    user.name = idinfo.get("name")
                db.commit()
                db.refresh(user)
        else:
            # Try finding by email (if they had a local account but now logged in via Firebase)
            if email:
                user = db.query(User).filter(User.email == email).first()
                
            if user:
                # Update existing user to include firebase_uid
                user.firebase_uid = uid
                db.commit()
                db.refresh(user)
            else:
                # Create user if doesn't exist
                if not email:
                    email = f"guest_{uid}@guest.local"
                    
                user = User(
                    email=email,
                    name=name,
                    auth_provider="firebase",
                    firebase_uid=uid
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
