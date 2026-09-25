from typing import List, Optional
from pydantic import BaseModel


class SymptomCount(BaseModel):
    symptom: str
    count: int


class FlowDistribution(BaseModel):
    flow: str
    count: int


class MoodDistribution(BaseModel):
    mood: str
    count: int


class SleepDistribution(BaseModel):
    sleep: str
    count: int


class AnalyticsSummary(BaseModel):
    total_records: int
    latest_observation_date: Optional[str] = None
    latest_flow: Optional[str] = None
    most_frequent_symptom: Optional[str] = None
    symptom_frequencies: List[SymptomCount]
    flow_distribution: List[FlowDistribution]
    mood_distribution: List[MoodDistribution]
    sleep_distribution: List[SleepDistribution]
    factual_statements: List[str]
