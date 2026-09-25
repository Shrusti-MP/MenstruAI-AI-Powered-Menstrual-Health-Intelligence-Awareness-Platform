from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.auth.dependencies import get_current_active_user
from app.services import recommendation_service

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])


@router.get("", response_model=List[Dict[str, Any]])
def get_recommendations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve rule-based, non-diagnostic educational recommendations."""
    return recommendation_service.get_personalized_recommendations(db, current_user.id)
