from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey, Text, Table
from sqlalchemy.orm import relationship
from app.database.base import Base


def utc_now():
    return datetime.now(timezone.utc)


class RecordSymptom(Base):
    __tablename__ = "record_symptoms"

    id = Column(Integer, primary_key=True, index=True)
    tracking_record_id = Column(Integer, ForeignKey("tracking_records.id", ondelete="CASCADE"), nullable=False, index=True)
    symptom_id = Column(Integer, ForeignKey("symptoms.id", ondelete="CASCADE"), nullable=False, index=True)


class Symptom(Base):
    __tablename__ = "symptoms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    tracking_records = relationship(
        "TrackingRecord",
        secondary="record_symptoms",
        back_populates="symptoms"
    )


class TrackingRecord(Base):
    __tablename__ = "tracking_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    flow = Column(String(50), nullable=True)   # Light, Medium, Heavy
    mood = Column(String(50), nullable=True)   # Good, Okay, Low, Irritated, Stressed
    sleep = Column(String(50), nullable=True)  # Poor, Average, Good
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)

    user = relationship("User", back_populates="tracking_records")
    symptoms = relationship(
        "Symptom",
        secondary="record_symptoms",
        back_populates="tracking_records"
    )
