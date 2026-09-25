from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.user import User
from app.schemas.tracking import (
    TrackingRecordCreate,
    TrackingRecordUpdate,
    TrackingRecordResponse,
    SymptomBase,
)
from app.schemas.auth import MessageResponse
from app.auth.dependencies import get_current_active_user
from app.services import tracking_service

router = APIRouter(prefix="/tracking", tags=["Tracking"])


@router.get("/symptoms", response_model=List[SymptomBase])
def get_symptoms_list(db: Session = Depends(get_db)):
    """Retrieve predefined list of trackable symptoms."""
    symptoms = tracking_service.get_all_symptoms(db)
    return symptoms


@router.post("", response_model=TrackingRecordResponse, status_code=status.HTTP_201_CREATED)
def create_record(
    record_in: TrackingRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Create a new health tracking record for the logged-in user."""
    return tracking_service.create_tracking_record(db, current_user.id, record_in)


@router.get("", response_model=List[TrackingRecordResponse])
def get_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get all tracking records for the authenticated user."""
    return tracking_service.get_user_tracking_records(db, current_user.id)


@router.get("/{record_id}", response_model=TrackingRecordResponse)
def get_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Get a single tracking record by ID, verifying user ownership."""
    return tracking_service.get_tracking_record_by_id(db, current_user.id, record_id)


@router.put("/{record_id}", response_model=TrackingRecordResponse)
def update_record(
    record_id: int,
    record_update: TrackingRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Update a tracking record, verifying user ownership."""
    return tracking_service.update_tracking_record(db, current_user.id, record_id, record_update)


@router.delete("/{record_id}", response_model=MessageResponse)
def delete_record(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """Delete a tracking record, verifying user ownership."""
    tracking_service.delete_tracking_record(db, current_user.id, record_id)
    return MessageResponse(message="Tracking record successfully deleted.")
