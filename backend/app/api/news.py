from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.connection import get_db
from app.models.models import PortfolioAsset, User
from app.auth.dependencies import get_current_user
from app.services.news_service import get_personalized_news

router = APIRouter(prefix="/news", tags=["news"])

@router.get("/")
def get_news(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Fetch user assets
    assets = db.query(PortfolioAsset).filter(PortfolioAsset.user_id == current_user.id).all()
    
    # Format assets for news service
    assets_data = [
        {"name": a.name, "type": a.type, "current_value": a.current_value, "quantity": a.quantity}
        for a in assets
    ]
    
    news_feed = get_personalized_news(assets_data)
    return news_feed
