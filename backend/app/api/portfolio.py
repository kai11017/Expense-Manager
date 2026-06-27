from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.connection import get_db
from app.models.models import PortfolioAsset, User
from app.schemas.schemas import AssetCreate, AssetUpdate, AssetOut
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/portfolio", tags=["portfolio"])

@router.get("/")
def get_portfolio(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    assets = db.query(PortfolioAsset).filter(PortfolioAsset.user_id == current_user.id).all()
    
    # Calculate totals
    total_financial_value = 0.0
    total_life_value = 0.0
    
    life_types = ["Health", "Learning", "Experiences", "Emergency Fund"]
    
    # Calculate total value for allocations
    for asset in assets:
        val = asset.current_value * asset.quantity
        if asset.type in life_types:
            total_life_value += val
        else:
            total_financial_value += val
            
    total_overall_value = total_financial_value + total_life_value
    
    assets_out = []
    for asset in assets:
        val = asset.current_value * asset.quantity
        cost = asset.purchase_price * asset.quantity
        profit_loss = val - cost
        return_pct = (profit_loss / cost * 100) if cost > 0 else 0.0
        
        # Determine allocation percentage
        alloc = 0.0
        if asset.type in life_types:
            alloc = (val / total_life_value * 100) if total_life_value > 0 else 0.0
        else:
            alloc = (val / total_financial_value * 100) if total_financial_value > 0 else 0.0
            
        assets_out.append({
            "id": asset.id,
            "name": asset.name,
            "type": asset.type,
            "purchase_price": asset.purchase_price,
            "current_value": asset.current_value,
            "quantity": asset.quantity,
            "purchase_date": asset.purchase_date,
            "notes": asset.notes,
            "profit_loss": profit_loss,
            "return_percentage": return_pct,
            "allocation": alloc,
            "total_value": val
        })
        
    return {
        "assets": assets_out,
        "summary": {
            "total_financial_value": total_financial_value,
            "total_life_value": total_life_value,
            "net_worth": total_overall_value,
            "overall_gain": sum(a["profit_loss"] for a in assets_out if a["type"] not in life_types),
            "life_investments": sum(a["total_value"] for a in assets_out if a["type"] in life_types)
        }
    }


@router.post("/", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
def create_asset(
    asset_in: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_asset = PortfolioAsset(
        user_id=current_user.id,
        name=asset_in.name,
        type=asset_in.type,
        purchase_price=asset_in.purchase_price,
        current_value=asset_in.current_value,
        quantity=asset_in.quantity,
        purchase_date=asset_in.purchase_date,
        notes=asset_in.notes
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset


@router.put("/{asset_id}", response_model=AssetOut)
def update_asset(
    asset_id: int,
    asset_in: AssetUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_asset = db.query(PortfolioAsset).filter(
        PortfolioAsset.id == asset_id,
        PortfolioAsset.user_id == current_user.id
    ).first()
    
    if not db_asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
        
    update_data = asset_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_asset, field, value)
        
    db.commit()
    db.refresh(db_asset)
    return db_asset


@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_asset = db.query(PortfolioAsset).filter(
        PortfolioAsset.id == asset_id,
        PortfolioAsset.user_id == current_user.id
    ).first()
    
    if not db_asset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Asset not found"
        )
        
    db.delete(db_asset)
    db.commit()
    return
