from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.models import Transaction, User
from app.schemas.schemas import TransactionCreate, TransactionUpdate, TransactionOut
from app.auth.dependencies import get_current_user
from app.services.parser_service import parse_csv_statement, parse_excel_statement, parse_pdf_statement

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=List[TransactionOut])
def get_transactions(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    category: Optional[str] = None,
    txn_type: Optional[str] = None,
    is_life_portfolio: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    if category:
        query = query.filter(Transaction.category == category)
    if txn_type:
        query = query.filter(Transaction.type == txn_type)
    if is_life_portfolio is not None:
        query = query.filter(Transaction.is_life_portfolio == is_life_portfolio)
        
    return query.order_by(Transaction.date.desc(), Transaction.id.desc()).all()


@router.post("/", response_model=TransactionOut, status_code=status.HTTP_201_CREATED)
def create_transaction(
    txn_in: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Determine is_life_portfolio automatically if category is Health, Learning, Experiences
    is_life = txn_in.is_life_portfolio
    life_cat = txn_in.life_category
    
    if txn_in.category in ["Health", "Learning", "Experiences"]:
        is_life = True
        life_cat = txn_in.category
        
    db_txn = Transaction(
        user_id=current_user.id,
        amount=txn_in.amount,
        type=txn_in.type,
        category=txn_in.category,
        date=txn_in.date,
        merchant=txn_in.merchant,
        payment_mode=txn_in.payment_mode,
        notes=txn_in.notes,
        is_life_portfolio=is_life,
        life_category=life_cat,
        reference_id=txn_in.reference_id
    )
    db.add(db_txn)
    db.commit()
    db.refresh(db_txn)
    return db_txn


@router.put("/{transaction_id}", response_model=TransactionOut)
def update_transaction(
    transaction_id: int,
    txn_in: TransactionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_txn = db.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()
    
    if not db_txn:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    update_data = txn_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_txn, field, value)
        
    # Recalculate is_life_portfolio if category was updated
    if "category" in update_data:
        if db_txn.category in ["Health", "Learning", "Experiences"]:
            db_txn.is_life_portfolio = True
            db_txn.life_category = db_txn.category
        else:
            db_txn.is_life_portfolio = False
            db_txn.life_category = None
            
    db.commit()
    db.refresh(db_txn)
    return db_txn


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_txn = db.query(Transaction).filter(
        Transaction.id == transaction_id, 
        Transaction.user_id == current_user.id
    ).first()
    
    if not db_txn:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
        
    db.delete(db_txn)
    db.commit()
    return


@router.post("/upload", response_model=List[TransactionOut])
async def upload_statement(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    filename = file.filename.lower()
    
    if not (filename.endswith('.csv') or filename.endswith('.xlsx') or filename.endswith('.pdf')):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV, Excel (.xlsx), and PDF bank statements are supported."
        )
        
    contents = await file.read()
    
    if filename.endswith('.csv'):
        parsed_txns = parse_csv_statement(contents)
    elif filename.endswith('.xlsx'):
        parsed_txns = parse_excel_statement(contents)
    elif filename.endswith('.pdf'):
        parsed_txns = parse_pdf_statement(contents)
    else:
        parsed_txns = []
    
    if not parsed_txns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid transactions could be parsed from the statement."
        )
        
    db_txns = []
    for item in parsed_txns:
        ref_id = item.get("reference_id")
        if ref_id:
            # Check if this transaction already exists for this user
            existing = db.query(Transaction).filter(
                Transaction.user_id == current_user.id,
                Transaction.reference_id == ref_id
            ).first()
            if existing:
                continue
                
        db_txn = Transaction(
            user_id=current_user.id,
            amount=item["amount"],
            type=item["type"],
            category=item["category"],
            date=item["date"],
            merchant=item["merchant"],
            payment_mode=item["payment_mode"],
            notes=item["notes"],
            is_life_portfolio=item["is_life_portfolio"],
            life_category=item["life_category"],
            reference_id=ref_id
        )
        db.add(db_txn)
        db_txns.append(db_txn)
        
    if not db_txns:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="All transactions in this statement have already been imported."
        )
        
    db.commit()
    for txn in db_txns:
        db.refresh(txn)
        
    return db_txns


@router.post("/bulk-delete", status_code=status.HTTP_204_NO_CONTENT)
def delete_transactions_bulk(
    ids: List[int] = Body(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(Transaction).filter(
        Transaction.id.in_(ids),
        Transaction.user_id == current_user.id
    ).delete(synchronize_session=False)
    db.commit()
    return
