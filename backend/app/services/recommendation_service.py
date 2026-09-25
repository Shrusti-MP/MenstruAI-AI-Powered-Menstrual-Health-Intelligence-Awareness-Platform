from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.tracking import TrackingRecord, Symptom
from app.models.quiz import QuizAttempt
from app.models.education import EducationalContent


def get_personalized_recommendations(db: Session, user_id: int) -> List[Dict[str, Any]]:
    """
    Generate rule-based educational recommendations based on user tracking observations
    and quiz participation. Strictly educational and non-diagnostic.
    """
    recommendations = []

    # 1. Fetch user's tracking records
    records = (
        db.query(TrackingRecord)
        .filter(TrackingRecord.user_id == user_id)
        .order_by(TrackingRecord.start_date.desc())
        .limit(10)
        .all()
    )

    # Count recent symptoms
    symptom_counts: Dict[str, int] = {}
    sleep_low_count = 0
    mood_stress_count = 0

    for r in records:
        for s in r.symptoms:
            symptom_counts[s.name] = symptom_counts.get(s.name, 0) + 1
        if r.sleep == "Poor":
            sleep_low_count += 1
        if r.mood in ["Stressed", "Low", "Irritated"]:
            mood_stress_count += 1

    # 2. Rule: Cramps recorded
    if symptom_counts.get("Cramps", 0) > 0:
        cramp_article = db.query(EducationalContent).filter(
            EducationalContent.title.ilike("%Common Symptoms%")
        ).first()
        recommendations.append({
            "id": "rec_cramps",
            "type": "symptom_awareness",
            "title": "Understanding Menstrual Cramps & Physiology",
            "reason": f"You logged cramps {symptom_counts['Cramps']} time(s) in your recent observations.",
            "recommendation": "Learn about the biological mechanisms of uterine contractions, comfort measures, and when to discuss persistent pain with a clinician.",
            "article_id": cramp_article.id if cramp_article else None,
            "category": "Common Symptoms",
            "disclaimer": "Educational information only; not medical advice or diagnosis."
        })

    # 3. Rule: Sleep or Fatigue
    if symptom_counts.get("Fatigue", 0) > 0 or sleep_low_count > 0:
        sleep_article = db.query(EducationalContent).filter(
            EducationalContent.title.ilike("%Sleep%")
        ).first()
        recommendations.append({
            "id": "rec_sleep",
            "type": "lifestyle_wellbeing",
            "title": "Sleep and Hormonal Rhythms",
            "reason": "You recently observed fatigue or disrupted sleep in your logs.",
            "recommendation": "Explore how progesterone and estrogen shifts influence body temperature and sleep cycles, plus practical sleep hygiene habits.",
            "article_id": sleep_article.id if sleep_article else None,
            "category": "Sleep",
            "disclaimer": "Educational information only; not medical advice or diagnosis."
        })

    # 4. Rule: Mood fluctuations or stress
    if symptom_counts.get("Mood Changes", 0) > 0 or mood_stress_count > 0:
        pms_article = db.query(EducationalContent).filter(
            EducationalContent.title.ilike("%PMS%")
        ).first()
        recommendations.append({
            "id": "rec_mood",
            "type": "emotional_wellbeing",
            "title": "Navigating PMS & Emotional Well-being",
            "reason": "You noted mood fluctuations or elevated stress levels in your observations.",
            "recommendation": "Read our guide explaining the neurochemical factors in the luteal phase and self-care strategies for emotional resilience.",
            "article_id": pms_article.id if pms_article else None,
            "category": "PMS",
            "disclaimer": "Educational information only; not medical advice or diagnosis."
        })

    # 5. Rule: Check Quiz performance
    latest_quiz = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user_id)
        .order_by(QuizAttempt.attempted_at.desc())
        .first()
    )

    if latest_quiz:
        percentage = (latest_quiz.score / latest_quiz.total_questions) * 100 if latest_quiz.total_questions > 0 else 0
        if percentage < 70:
            basics_article = db.query(EducationalContent).filter(
                EducationalContent.title.ilike("%Understanding Menstruation%")
            ).first()
            recommendations.append({
                "id": "rec_quiz_basics",
                "type": "literacy_strengthening",
                "title": "Deepen Your Menstrual Health Literacy",
                "reason": f"Your latest quiz score was {round(percentage)}%.",
                "recommendation": "Review our foundational articles on cycle phases and hormonal fluctuations to boost your menstrual literacy.",
                "article_id": basics_article.id if basics_article else None,
                "category": "Menstrual Health Basics",
                "disclaimer": "Educational information only; not medical advice or diagnosis."
            })
    else:
        # User has not taken quiz yet
        recommendations.append({
            "id": "rec_take_quiz",
            "type": "knowledge_check",
            "title": "Test Your Menstrual Health Literacy",
            "reason": "You haven't completed a health literacy quiz yet.",
            "recommendation": "Take our 10-question evidence-backed quiz to debunk common myths and measure your menstrual health awareness.",
            "article_id": None,
            "category": "Health Literacy",
            "disclaimer": "Educational information only; not medical advice or diagnosis."
        })

    # 6. Default recommendations if user has zero logs
    if len(records) == 0:
        basics_article = db.query(EducationalContent).filter(
            EducationalContent.category == "Menstrual Health Basics"
        ).first()
        recommendations.append({
            "id": "rec_getting_started",
            "type": "onboarding",
            "title": "Foundations of Menstrual Health",
            "reason": "Welcome to MenstruAI! Start your journey by learning about your cycle phases.",
            "recommendation": "Read our comprehensive guide to understanding cycle variations, normal ranges, and body signals.",
            "article_id": basics_article.id if basics_article else None,
            "category": "Menstrual Health Basics",
            "disclaimer": "Educational information only; not medical advice or diagnosis."
        })

    return recommendations
