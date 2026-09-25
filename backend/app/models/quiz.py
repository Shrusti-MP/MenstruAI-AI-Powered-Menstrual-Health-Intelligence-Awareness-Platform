from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.base import Base


def utc_now():
    return datetime.now(timezone.utc)


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(Text, nullable=False)
    explanation = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, default="General")
    difficulty = Column(String(20), nullable=False, default="Medium")
    question_type = Column(String(50), nullable=False, default="single_choice")
    is_active = Column(Boolean, nullable=False, default=True)

    options = relationship("QuizOption", back_populates="question", cascade="all, delete-orphan")
    attempt_questions = relationship("QuizAttemptQuestion", back_populates="question", cascade="all, delete-orphan")


class QuizOption(Base):
    __tablename__ = "quiz_options"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    option_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False, nullable=False)

    question = relationship("QuizQuestion", back_populates="options")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    attempted_at = Column(DateTime, default=utc_now, nullable=False)

    user = relationship("User", back_populates="quiz_attempts")
    attempt_questions = relationship("QuizAttemptQuestion", back_populates="attempt", cascade="all, delete-orphan")


class QuizAttemptQuestion(Base):
    __tablename__ = "quiz_attempt_questions"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), nullable=False, index=True)
    question_id = Column(Integer, ForeignKey("quiz_questions.id", ondelete="CASCADE"), nullable=False, index=True)
    selected_option_id = Column(Integer, nullable=True)
    is_correct = Column(Boolean, nullable=False, default=False)

    attempt = relationship("QuizAttempt", back_populates="attempt_questions")
    question = relationship("QuizQuestion", back_populates="attempt_questions")
