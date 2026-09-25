from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.analytics import (
    AnalyticsSummary,
    SymptomCount,
    FlowDistribution,
    MoodDistribution,
    SleepDistribution,
)
from app.auth.dependencies import get_current_active_user
from app.services import analytics_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve complete analytics summary with factual, non-diagnostic observations."""
    return analytics_service.get_user_analytics(db, current_user.id)


@router.get("/symptoms", response_model=List[SymptomCount])
def get_symptom_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve frequency counts of recorded symptoms."""
    summary = analytics_service.get_user_analytics(db, current_user.id)
    return summary.symptom_frequencies


@router.get("/flow", response_model=List[FlowDistribution])
def get_flow_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve breakdown of logged flow levels."""
    summary = analytics_service.get_user_analytics(db, current_user.id)
    return summary.flow_distribution


@router.get("/mood", response_model=List[MoodDistribution])
def get_mood_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve breakdown of logged mood states."""
    summary = analytics_service.get_user_analytics(db, current_user.id)
    return summary.mood_distribution


@router.get("/sleep", response_model=List[SleepDistribution])
def get_sleep_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve breakdown of logged sleep qualities."""
    summary = analytics_service.get_user_analytics(db, current_user.id)
    return summary.sleep_distribution
