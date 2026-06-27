from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from collections import defaultdict
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import Transaction, PortfolioAsset, Goal, Budget, AIAdvice, User
from app.schemas.schemas import DashboardSummary
from app.auth.dependencies import get_current_user
from app.services.prediction_service import get_predictions_and_warnings
from app.services.ai_service import get_ai_advice

router = APIRouter(prefix="/advisor", tags=["advisor"])

@router.get("/summary", response_model=DashboardSummary)
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch data
    txns = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    assets = db.query(PortfolioAsset).filter(PortfolioAsset.user_id == current_user.id).all()
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    budgets = db.query(Budget).filter(Budget.user_id == current_user.id).all()
    
    # 1. Monthly Spending & Income (for current calendar month)
    today = datetime.today()
    current_month_str = today.strftime("%Y-%m")
    
    monthly_spending = 0.0
    monthly_income = 0.0
    
    # Group by category for top category calculation
    cat_spending = defaultdict(float)
    
    for t in txns:
        # Date parsing
        try:
            dt = datetime.strptime(t.date, "%Y-%m-%d")
            m_str = dt.strftime("%Y-%m")
            if m_str == current_month_str:
                if t.type == "expense":
                    monthly_spending += t.amount
                elif t.type == "income":
                    monthly_income += t.amount
            
            # Category spending (last 30 days)
            if t.type == "expense" and (today - dt).days <= 30:
                cat_spending[t.category] += t.amount
        except Exception:
            continue
            
    # Top Category
    top_cat = "None"
    if cat_spending:
        top_cat = max(cat_spending, key=cat_spending.get)
        
    # 2. Net Worth & Return
    life_types = ["Health", "Learning", "Experiences", "Emergency Fund"]
    financial_value = 0.0
    financial_cost = 0.0
    life_value = 0.0
    
    assets_list = []
    for a in assets:
        val = a.current_value * a.quantity
        cost = a.purchase_price * a.quantity
        if a.type in life_types:
            life_value += val
        else:
            financial_value += val
            financial_cost += cost
            
        assets_list.append({
            "name": a.name,
            "type": a.type,
            "purchase_price": a.purchase_price,
            "current_value": a.current_value,
            "quantity": a.quantity,
            "total_value": val
        })
        
    net_worth = financial_value + life_value
    
    overall_gain_pct = 0.0
    if financial_cost > 0:
        overall_gain_pct = ((financial_value - financial_cost) / financial_cost) * 100
        
    # 3. Budget Left
    total_budget_amount = sum(b.amount for b in budgets if b.month == current_month_str)
    # If no budgets set, defaults to 0.0
    budget_left = max(0.0, total_budget_amount - monthly_spending) if total_budget_amount > 0 else 0.0
    
    # 4. Predictions & Warnings
    pred_data = get_predictions_and_warnings(txns)
    warnings = pred_data["warnings"]
    predicted_spending = pred_data["total_predicted_spending"]
    
    warning_msg = None
    if warnings:
        warning_msg = f"{len(warnings)} categories are seeing sharp increases, including: {', '.join(w['category'] for w in warnings)}."
        
    # 5. Build AI advisor profile
    profile = {
        "monthly_income": monthly_income if monthly_income > 0 else 25000.0, # default backup if empty
        "monthly_spending": monthly_spending,
        "financial_value": financial_value,
        "life_value": life_value,
        "assets": assets_list,
        "warnings": warnings,
        "goals": [{"name": g.name, "target_amount": g.target_amount, "current_amount": g.current_amount, "target_date": g.target_date} for g in goals]
    }
    
    # Run AI advice
    ai_advice_text = get_ai_advice(profile)
    
    # Fetch recent transactions (latest 5)
    recent_transactions = sorted(txns, key=lambda x: (x.date, x.id), reverse=True)[:5]
    
    # Fetch goals
    goals_out = goals[:5] # limit to 5
    
    return {
        "net_worth": net_worth,
        "monthly_spending": monthly_spending,
        "monthly_income": monthly_income,
        "budget_left": budget_left,
        "top_category": top_cat,
        "investment_return": round(overall_gain_pct, 2),
        "recent_transactions": recent_transactions,
        "goals_progress": goals_out,
        "prediction": predicted_spending,
        "prediction_warning": warning_msg,
        "ai_advice": ai_advice_text
    }


@router.get("/predictions")
def get_predictions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    txns = db.query(Transaction).filter(Transaction.user_id == current_user.id).all()
    pred_data = get_predictions_and_warnings(txns)
    return pred_data
