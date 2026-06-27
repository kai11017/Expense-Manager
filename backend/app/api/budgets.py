from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.database.connection import get_db
from app.models.models import Budget, User
from app.schemas.schemas import BudgetCreate, BudgetOut
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/budgets", tags=["budgets"])

@router.get("/", response_model=List[BudgetOut])
def get_budgets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    month: str = None
):
    """
    Get budgets for the user. If month is provided, filter by month (YYYY-MM).
    Otherwise, return budgets for the current month.
    """
    if not month:
        month = datetime.today().strftime("%Y-%m")
        
    budgets = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.month == month
    ).all()
    return budgets

@router.post("/", response_model=BudgetOut)
def create_or_update_budget(
    budget_in: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new budget or update an existing budget for a category and month.
    """
    # Check if budget already exists for this category and month
    existing_budget = db.query(Budget).filter(
        Budget.user_id == current_user.id,
        Budget.category == budget_in.category,
        Budget.month == budget_in.month
    ).first()

    if existing_budget:
        existing_budget.amount = budget_in.amount
        db.commit()
        db.refresh(existing_budget)
        return existing_budget
    else:
        new_budget = Budget(
            user_id=current_user.id,
            category=budget_in.category,
            amount=budget_in.amount,
            month=budget_in.month
        )
        db.add(new_budget)
        db.commit()
        db.refresh(new_budget)
        return new_budget

@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_budget(
    budget_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a budget by ID.
    """
    budget = db.query(Budget).filter(
        Budget.id == budget_id,
        Budget.user_id == current_user.id
    ).first()
    
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found")
        
    db.delete(budget)
    db.commit()
    return None
