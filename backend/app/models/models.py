from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
import datetime
from app.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    assets = relationship("PortfolioAsset", back_populates="user", cascade="all, delete-orphan")
    budgets = relationship("Budget", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    advices = relationship("AIAdvice", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, default="expense") # "expense" or "income"
    category = Column(String, nullable=False) # e.g. "Food", "Rent", "Health", "Learning"
    date = Column(String, nullable=False) # Store as "YYYY-MM-DD"
    merchant = Column(String, nullable=True)
    payment_mode = Column(String, nullable=False) # "UPI", "Cash", "Credit Card", "Net Banking"
    notes = Column(String, nullable=True)
    
    # Life Portfolio details
    is_life_portfolio = Column(Boolean, default=False)
    life_category = Column(String, nullable=True) # "Health", "Learning", "Experiences", "Emergency Fund"

    user = relationship("User", back_populates="transactions")


class PortfolioAsset(Base):
    __tablename__ = "portfolio_assets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Reliance Industries", "Gym Membership", "Gold ETF"
    type = Column(String, nullable=False) # "Stock", "Mutual Fund", "Gold", "FD", "Crypto", "Bonds", "Real Estate", "PPF", "EPF", "Health", "Learning", "Experiences"
    purchase_price = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    quantity = Column(Float, default=1.0)
    allocation = Column(Float, default=0.0) # calculated or manual
    purchase_date = Column(String, nullable=True) # "YYYY-MM-DD"
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="assets")


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    month = Column(String, nullable=False) # "YYYY-MM"

    user = relationship("User", back_populates="budgets")


class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Emergency Fund", "Europe Trip", "Car"
    target_amount = Column(Float, nullable=False)
    current_amount = Column(Float, default=0.0)
    target_date = Column(String, nullable=True) # "YYYY-MM-DD"
    category = Column(String, nullable=True) # "Financial", "Health", "Learning", "Experiences"

    user = relationship("User", back_populates="goals")


class AIAdvice(Base):
    __tablename__ = "ai_advices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    advice_text = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="advices")
