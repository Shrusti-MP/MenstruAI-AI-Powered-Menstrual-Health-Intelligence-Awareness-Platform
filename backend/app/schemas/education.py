from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class EducationalContentResponse(BaseModel):
    id: int
    title: str
    category: str
    short_description: str
    content: str
    source: Optional[str] = None
    source_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MythFactResponse(BaseModel):
    id: int
    myth: str
    fact: str
    explanation: str
    source: Optional[str] = None
    source_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
