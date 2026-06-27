from pydantic import BaseModel, EmailStr
from typing import Optional, List
import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    email: str
    name: Optional[str]

class TokenData(BaseModel):
    email: Optional[str] = None


# Transaction schemas
class TransactionBase(BaseModel):
    amount: float
    type: str = "expense" # "expense" or "income"
    category: str
    date: str # "YYYY-MM-DD"
    merchant: Optional[str] = None
    payment_mode: str
    notes: Optional[str] = None
    is_life_portfolio: Optional[bool] = False
    life_category: Optional[str] = None # "Health", "Learning", "Experiences", "Emergency Fund"

class TransactionCreate(TransactionBase):
    pass

class TransactionUpdate(BaseModel):
    amount: Optional[float] = None
    type: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    merchant: Optional[str] = None
    payment_mode: Optional[str] = None
    notes: Optional[str] = None
    is_life_portfolio: Optional[bool] = None
    life_category: Optional[str] = None

class TransactionOut(TransactionBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# Portfolio schemas
class AssetBase(BaseModel):
    name: str
    type: str # "Stock", "Mutual Fund", "Gold", "FD", "Crypto", "Bonds", "Real Estate", "PPF", "EPF", "Health", "Learning", "Experiences"
    purchase_price: float
    current_value: float
    quantity: float = 1.0
    purchase_date: Optional[str] = None
    notes: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    purchase_price: Optional[float] = None
    current_value: Optional[float] = None
    quantity: Optional[float] = None
    purchase_date: Optional[str] = None
    notes: Optional[str] = None

class AssetOut(AssetBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# Budget schemas
class BudgetBase(BaseModel):
    category: str
    amount: float
    month: str # "YYYY-MM"

class BudgetCreate(BudgetBase):
    pass

class BudgetOut(BudgetBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# Goal schemas
class GoalBase(BaseModel):
    name: str
    target_amount: float
    current_amount: float = 0.0
    target_date: Optional[str] = None
    category: Optional[str] = None # "Financial", "Health", "Learning", "Experiences"

class GoalCreate(GoalBase):
    pass

class GoalOut(GoalBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True


# AI Advice schemas
class AIAdviceOut(BaseModel):
    id: int
    user_id: int
    advice_text: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


# Dashboard Out Schema
class DashboardSummary(BaseModel):
    net_worth: float
    monthly_spending: float
    monthly_income: float
    budget_left: float
    top_category: str
    investment_return: float
    recent_transactions: List[TransactionOut]
    goals_progress: List[GoalOut]
    prediction: float
    prediction_warning: Optional[str] = None
    ai_advice: str
