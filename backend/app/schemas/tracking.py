from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class SymptomBase(BaseModel):
    id: int
    name: str
    category: Optional[str] = None
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class TrackingRecordCreate(BaseModel):
    start_date: date
    end_date: Optional[date] = None
    flow: Optional[str] = Field(None, description="Light, Medium, Heavy")
    mood: Optional[str] = Field(None, description="Good, Okay, Low, Irritated, Stressed")
    sleep: Optional[str] = Field(None, description="Poor, Average, Good")
    notes: Optional[str] = None
    symptom_ids: List[int] = Field(default=[], description="List of symptom IDs recorded")


class TrackingRecordUpdate(BaseModel):
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    flow: Optional[str] = None
    mood: Optional[str] = None
    sleep: Optional[str] = None
    notes: Optional[str] = None
    symptom_ids: Optional[List[int]] = None


class TrackingRecordResponse(BaseModel):
    id: int
    user_id: int
    start_date: date
    end_date: Optional[date] = None
    flow: Optional[str] = None
    mood: Optional[str] = None
    sleep: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    symptoms: List[SymptomBase] = []

    model_config = ConfigDict(from_attributes=True)
