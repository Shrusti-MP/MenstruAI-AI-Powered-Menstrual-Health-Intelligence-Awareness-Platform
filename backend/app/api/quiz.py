from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.quiz import (
    QuizQuestionResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizStatsResponse,
)
from app.auth.dependencies import get_current_active_user, get_optional_user
from app.services import quiz_service

router = APIRouter(prefix="/quiz", tags=["Quiz"])


@router.get("", response_model=List[QuizQuestionResponse])
def get_quiz_questions(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    """Retrieve quiz questions with anti-repetition, difficulty balancing, and option shuffling."""
    user_id = current_user.id if current_user else None
    return quiz_service.get_quiz_questions(db, user_id=user_id)


@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz(
    submission: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Submit quiz answers, compute score, save attempt with question tracking, and return breakdown."""
    return quiz_service.submit_quiz_attempt(db, current_user.id, submission)


@router.get("/history", response_model=QuizStatsResponse)
def get_quiz_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Retrieve the user's historical quiz attempts and summary statistics."""
    return quiz_service.get_user_quiz_stats(db, current_user.id)
