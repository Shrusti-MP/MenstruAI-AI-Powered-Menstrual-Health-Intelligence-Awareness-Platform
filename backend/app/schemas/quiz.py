from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class QuizOptionResponse(BaseModel):
    id: int
    option_text: str

    model_config = ConfigDict(from_attributes=True)


class QuizQuestionResponse(BaseModel):
    id: int
    question: str
    category: str
    difficulty: str = "Medium"
    question_type: str = "single_choice"
    options: List[QuizOptionResponse]

    model_config = ConfigDict(from_attributes=True)


class QuizAnswerSubmission(BaseModel):
    question_id: int
    selected_option_id: int


class QuizSubmitRequest(BaseModel):
    answers: List[QuizAnswerSubmission]


class QuizQuestionResult(BaseModel):
    question_id: int
    question: str
    category: str = "General"
    difficulty: str = "Medium"
    selected_option_id: int
    correct_option_id: int
    selected_text: str
    correct_text: str
    is_correct: bool
    explanation: str


class QuizResultResponse(BaseModel):
    score: int
    total_questions: int
    percentage: float
    results: List[QuizQuestionResult]


class QuizAttemptResponse(BaseModel):
    id: int
    user_id: int
    score: int
    total_questions: int
    percentage: float
    attempted_at: datetime

    model_config = ConfigDict(from_attributes=True)


class QuizStatsResponse(BaseModel):
    total_attempts: int
    latest_score: Optional[int] = None
    best_score: Optional[int] = None
    attempts: List[QuizAttemptResponse] = []
