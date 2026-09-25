from collections import Counter
from typing import Dict, List, Optional
from sqlalchemy.orm import Session
from app.models.tracking import TrackingRecord, Symptom, RecordSymptom
from app.schemas.analytics import (
    AnalyticsSummary,
    SymptomCount,
    FlowDistribution,
    MoodDistribution,
    SleepDistribution,
)


def get_user_analytics(db: Session, user_id: int) -> AnalyticsSummary:
    records = (
        db.query(TrackingRecord)
        .filter(TrackingRecord.user_id == user_id)
        .order_by(TrackingRecord.start_date.desc())
        .all()
    )

    total_records = len(records)
    if total_records == 0:
        return AnalyticsSummary(
            total_records=0,
            latest_observation_date=None,
            latest_flow=None,
            most_frequent_symptom=None,
            symptom_frequencies=[],
            flow_distribution=[],
            mood_distribution=[],
            sleep_distribution=[],
            factual_statements=[
                "No health observations recorded yet. Start tracking your cycle to view personalized analytics."
            ],
        )

    # 1. Latest record info
    latest_record = records[0]
    latest_observation_date = latest_record.start_date.isoformat() if latest_record.start_date else None
    latest_flow = latest_record.flow

    # 2. Symptoms count
    symptom_counter: Counter = Counter()
    for record in records:
        for sym in record.symptoms:
            symptom_counter[sym.name] += 1

    symptom_frequencies = [
        SymptomCount(symptom=name, count=count)
        for name, count in symptom_counter.most_common()
    ]

    # Pre-populate all standard symptoms with 0 if not present, so charts render cleanly
    standard_symptoms = ["Cramps", "Headache", "Fatigue", "Bloating", "Mood Changes", "Back Pain", "Breast Tenderness"]
    existing_sym_names = {s.symptom for s in symptom_frequencies}
    for s_name in standard_symptoms:
        if s_name not in existing_sym_names:
            symptom_frequencies.append(SymptomCount(symptom=s_name, count=0))

    most_frequent_symptom = symptom_counter.most_common(1)[0][0] if symptom_counter else None

    # 3. Flow distribution
    flow_counter: Counter = Counter()
    for record in records:
        if record.flow:
            flow_counter[record.flow] += 1

    flow_distribution = [
        FlowDistribution(flow=flow_type, count=flow_counter.get(flow_type, 0))
        for flow_type in ["Light", "Medium", "Heavy"]
    ]

    # 4. Mood distribution
    mood_counter: Counter = Counter()
    for record in records:
        if record.mood:
            mood_counter[record.mood] += 1

    mood_distribution = [
        MoodDistribution(mood=mood_type, count=mood_counter.get(mood_type, 0))
        for mood_type in ["Good", "Okay", "Low", "Irritated", "Stressed"]
    ]

    # 5. Sleep distribution
    sleep_counter: Counter = Counter()
    for record in records:
        if record.sleep:
            sleep_counter[record.sleep] += 1

    sleep_distribution = [
        SleepDistribution(sleep=sleep_type, count=sleep_counter.get(sleep_type, 0))
        for sleep_type in ["Good", "Average", "Poor"]
    ]

    # 6. Factual statements (descriptive only, strictly non-diagnostic)
    factual_statements: List[str] = [
        f"You have recorded a total of {total_records} health observation{'s' if total_records != 1 else ''} in your history."
    ]

    if most_frequent_symptom and symptom_counter[most_frequent_symptom] > 0:
        c = symptom_counter[most_frequent_symptom]
        factual_statements.append(
            f"'{most_frequent_symptom}' was recorded {c} time{'s' if c != 1 else ''} across your available records."
        )

    if latest_flow:
        factual_statements.append(
            f"Your most recently recorded flow level was logged as {latest_flow}."
        )

    # Most recorded mood
    if mood_counter:
        top_mood, top_mood_count = mood_counter.most_common(1)[0]
        factual_statements.append(
            f"'{top_mood}' was your most frequently logged mood state ({top_mood_count} time{'s' if top_mood_count != 1 else ''})."
        )

    # Sleep factual note
    if sleep_counter:
        top_sleep, top_sleep_count = sleep_counter.most_common(1)[0]
        factual_statements.append(
            f"Sleep quality was logged as '{top_sleep}' most often ({top_sleep_count} time{'s' if top_sleep_count != 1 else ''})."
        )

    return AnalyticsSummary(
        total_records=total_records,
        latest_observation_date=latest_observation_date,
        latest_flow=latest_flow,
        most_frequent_symptom=most_frequent_symptom,
        symptom_frequencies=symptom_frequencies,
        flow_distribution=flow_distribution,
        mood_distribution=mood_distribution,
        sleep_distribution=sleep_distribution,
        factual_statements=factual_statements,
    )
