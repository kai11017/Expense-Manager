from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.models import Goal, User
from app.schemas.schemas import GoalCreate, GoalOut
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/", response_model=List[GoalOut])
def get_goals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Goal).filter(Goal.user_id == current_user.id).all()


@router.post("/", response_model=GoalOut, status_code=status.HTTP_201_CREATED)
def create_goal(
    goal_in: GoalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = Goal(
        user_id=current_user.id,
        name=goal_in.name,
        target_amount=goal_in.target_amount,
        current_amount=goal_in.current_amount,
        target_date=goal_in.target_date,
        category=goal_in.category
    )
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal


@router.put("/{goal_id}", response_model=GoalOut)
def update_goal(
    goal_id: int,
    goal_in: GoalCreate, # Reuse creation schema since they're identical
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not db_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
        
    db_goal.name = goal_in.name
    db_goal.target_amount = goal_in.target_amount
    db_goal.current_amount = goal_in.current_amount
    db_goal.target_date = goal_in.target_date
    db_goal.category = goal_in.category
    
    db.commit()
    db.refresh(db_goal)
    return db_goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_goal(
    goal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not db_goal:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Goal not found"
        )
    db.delete(db_goal)
    db.commit()
    return
