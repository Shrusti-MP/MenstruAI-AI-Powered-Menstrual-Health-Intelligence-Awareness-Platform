from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database.base import Base


def utc_now():
    return datetime.now(timezone.utc)


class EducationalContent(Base):
    __tablename__ = "educational_content"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    short_description = Column(Text, nullable=False)
    content = Column(Text, nullable=False)
    source = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=utc_now, nullable=False)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now, nullable=False)


class MythFact(Base):
    __tablename__ = "myths_facts"

    id = Column(Integer, primary_key=True, index=True)
    myth = Column(Text, nullable=False)
    fact = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    source = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
