from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.tracking import TrackingRecord, Symptom, RecordSymptom
from app.schemas.tracking import TrackingRecordCreate, TrackingRecordUpdate


def get_all_symptoms(db: Session) -> List[Symptom]:
    return db.query(Symptom).order_by(Symptom.id).all()


def create_tracking_record(
    db: Session,
    user_id: int,
    record_in: TrackingRecordCreate
) -> TrackingRecord:
    # Validate start_date <= end_date if end_date provided
    if record_in.end_date and record_in.end_date < record_in.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date."
        )

    # Create TrackingRecord
    db_record = TrackingRecord(
        user_id=user_id,
        start_date=record_in.start_date,
        end_date=record_in.end_date,
        flow=record_in.flow,
        mood=record_in.mood,
        sleep=record_in.sleep,
        notes=record_in.notes,
    )
    db.add(db_record)
    db.flush()  # assign ID

    # Attach symptoms
    if record_in.symptom_ids:
        # verify symptoms exist
        valid_symptoms = db.query(Symptom).filter(Symptom.id.in_(record_in.symptom_ids)).all()
        for sym in valid_symptoms:
            link = RecordSymptom(tracking_record_id=db_record.id, symptom_id=sym.id)
            db.add(link)

    db.commit()
    db.refresh(db_record)
    return db_record


def get_user_tracking_records(db: Session, user_id: int) -> List[TrackingRecord]:
    return (
        db.query(TrackingRecord)
        .filter(TrackingRecord.user_id == user_id)
        .order_by(TrackingRecord.start_date.desc(), TrackingRecord.created_at.desc())
        .all()
    )


def get_tracking_record_by_id(
    db: Session,
    user_id: int,
    record_id: int
) -> TrackingRecord:
    record = (
        db.query(TrackingRecord)
        .filter(TrackingRecord.id == record_id, TrackingRecord.user_id == user_id)
        .first()
    )
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Tracking record not found or unauthorized access"
        )
    return record


def update_tracking_record(
    db: Session,
    user_id: int,
    record_id: int,
    record_update: TrackingRecordUpdate
) -> TrackingRecord:
    db_record = get_tracking_record_by_id(db, user_id, record_id)

    if record_update.start_date is not None:
        db_record.start_date = record_update.start_date
    if record_update.end_date is not None:
        db_record.end_date = record_update.end_date

    if db_record.end_date and db_record.start_date and db_record.end_date < db_record.start_date:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="End date cannot be earlier than start date."
        )

    if record_update.flow is not None:
        db_record.flow = record_update.flow
    if record_update.mood is not None:
        db_record.mood = record_update.mood
    if record_update.sleep is not None:
        db_record.sleep = record_update.sleep
    if record_update.notes is not None:
        db_record.notes = record_update.notes

    if record_update.symptom_ids is not None:
        # Remove existing links
        db.query(RecordSymptom).filter(RecordSymptom.tracking_record_id == db_record.id).delete()
        # Add new links
        valid_symptoms = db.query(Symptom).filter(Symptom.id.in_(record_update.symptom_ids)).all()
        for sym in valid_symptoms:
            link = RecordSymptom(tracking_record_id=db_record.id, symptom_id=sym.id)
            db.add(link)

    db.commit()
    db.refresh(db_record)
    return db_record


def delete_tracking_record(db: Session, user_id: int, record_id: int) -> None:
    db_record = get_tracking_record_by_id(db, user_id, record_id)
    db.delete(db_record)
    db.commit()
