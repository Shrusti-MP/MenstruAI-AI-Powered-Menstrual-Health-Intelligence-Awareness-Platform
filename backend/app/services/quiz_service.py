import random
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.quiz import QuizQuestion, QuizOption, QuizAttempt, QuizAttemptQuestion
from app.schemas.quiz import (
    QuizQuestionResponse,
    QuizOptionResponse,
    QuizSubmitRequest,
    QuizResultResponse,
    QuizQuestionResult,
    QuizStatsResponse,
    QuizAttemptResponse,
)


def get_quiz_questions(db: Session, user_id: Optional[int] = None, count: int = 10) -> List[QuizQuestionResponse]:
    """
    Selects 10 dynamic quiz questions with:
    1. Anti-repetition: Excludes questions previously attempted by this user.
    2. Pool exhaustion handling: Resets user's question pool when exhausted so testing continues smoothly.
    3. Balanced difficulty: 5 Easy, 3 Medium, 2 Hard across diverse categories.
    4. Randomization: Randomizes question selection, question order, and option order.
    """
    all_questions = db.query(QuizQuestion).filter(QuizQuestion.is_active == True).all()
    if not all_questions:
        return []

    attempted_set = set()
    if user_id:
        attempted_qids = (
            db.query(QuizAttemptQuestion.question_id)
            .join(QuizAttempt, QuizAttempt.id == QuizAttemptQuestion.attempt_id)
            .filter(QuizAttempt.user_id == user_id)
            .distinct()
            .all()
        )
        attempted_set = {r[0] for r in attempted_qids}

    # Available pool: questions not yet attempted by this user
    eligible = [q for q in all_questions if q.id not in attempted_set]

    # Partition by difficulty: 5 Easy, 3 Medium, 2 Hard
    easy_pool = [q for q in eligible if (q.difficulty or "").lower() == "easy"]
    med_pool = [q for q in eligible if (q.difficulty or "").lower() == "medium"]
    hard_pool = [q for q in eligible if (q.difficulty or "").lower() == "hard"]

    # If remaining unseen questions cannot satisfy the balanced ratio (5 Easy, 3 Medium, 2 Hard)
    # or the total unseen pool is under count, reset user's question history for a fresh round.
    if len(eligible) < count or len(easy_pool) < 5 or len(med_pool) < 3 or len(hard_pool) < 2:
        if user_id:
            subquery = db.query(QuizAttempt.id).filter(QuizAttempt.user_id == user_id)
            db.query(QuizAttemptQuestion).filter(QuizAttemptQuestion.attempt_id.in_(subquery)).delete(synchronize_session=False)
            db.commit()
        eligible = list(all_questions)
        easy_pool = [q for q in eligible if (q.difficulty or "").lower() == "easy"]
        med_pool = [q for q in eligible if (q.difficulty or "").lower() == "medium"]
        hard_pool = [q for q in eligible if (q.difficulty or "").lower() == "hard"]

    random.shuffle(easy_pool)
    random.shuffle(med_pool)
    random.shuffle(hard_pool)

    selected = []
    selected.extend(easy_pool[:5])
    selected.extend(med_pool[:3])
    selected.extend(hard_pool[:2])

    # If any difficulty bucket had fewer than target, fill from remaining eligible
    if len(selected) < count:
        selected_ids = {q.id for q in selected}
        remaining_eligible = [q for q in eligible if q.id not in selected_ids]
        random.shuffle(remaining_eligible)
        needed = count - len(selected)
        selected.extend(remaining_eligible[:needed])

    # If still under count (e.g. total questions in system < count), fill from all
    if len(selected) < count:
        selected_ids = {q.id for q in selected}
        remaining_all = [q for q in all_questions if q.id not in selected_ids]
        random.shuffle(remaining_all)
        needed = count - len(selected)
        selected.extend(remaining_all[:needed])

    # Randomize question display sequence
    random.shuffle(selected)

    results = []
    for q in selected:
        # Randomize option order while preserving option IDs
        opts = [
            QuizOptionResponse(id=opt.id, option_text=opt.option_text)
            for opt in q.options
        ]
        random.shuffle(opts)

        results.append(
            QuizQuestionResponse(
                id=q.id,
                question=q.question,
                category=q.category,
                difficulty=q.difficulty or "Medium",
                question_type=q.question_type or "single_choice",
                options=opts,
            )
        )
    return results


def submit_quiz_attempt(
    db: Session,
    user_id: int,
    submission: QuizSubmitRequest
) -> QuizResultResponse:
    if not submission.answers:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No answers provided in quiz submission"
        )

    score = 0
    results: List[QuizQuestionResult] = []

    answer_map = {ans.question_id: ans.selected_option_id for ans in submission.answers}
    question_ids = list(answer_map.keys())

    db_questions = db.query(QuizQuestion).filter(QuizQuestion.id.in_(question_ids)).all()

    # Create the attempt record
    attempt = QuizAttempt(
        user_id=user_id,
        score=0,
        total_questions=len(db_questions),
    )
    db.add(attempt)
    db.flush()

    for q in db_questions:
        selected_option_id = answer_map.get(q.id)
        selected_option = next((opt for opt in q.options if opt.id == selected_option_id), None)
        correct_option = next((opt for opt in q.options if opt.is_correct), None)

        is_correct = (selected_option is not None and selected_option.is_correct)
        if is_correct:
            score += 1

        selected_text = selected_option.option_text if selected_option else "Not answered"
        correct_text = correct_option.option_text if correct_option else "N/A"
        correct_id = correct_option.id if correct_option else 0

        # Record question attempt history for anti-repetition tracking
        attempt_q = QuizAttemptQuestion(
            attempt_id=attempt.id,
            question_id=q.id,
            selected_option_id=selected_option_id,
            is_correct=is_correct,
        )
        db.add(attempt_q)

        results.append(
            QuizQuestionResult(
                question_id=q.id,
                question=q.question,
                category=q.category,
                difficulty=q.difficulty or "Medium",
                selected_option_id=selected_option_id or 0,
                correct_option_id=correct_id,
                selected_text=selected_text,
                correct_text=correct_text,
                is_correct=is_correct,
                explanation=q.explanation,
            )
        )

    total_questions = len(db_questions)
    percentage = round((score / total_questions) * 100, 1) if total_questions > 0 else 0.0

    attempt.score = score
    attempt.total_questions = total_questions
    db.commit()
    db.refresh(attempt)

    return QuizResultResponse(
        score=score,
        total_questions=total_questions,
        percentage=percentage,
        results=results,
    )


def get_user_quiz_stats(db: Session, user_id: int) -> QuizStatsResponse:
    attempts = (
        db.query(QuizAttempt)
        .filter(QuizAttempt.user_id == user_id)
        .order_by(QuizAttempt.attempted_at.desc())
        .all()
    )

    total_attempts = len(attempts)
    latest_score = attempts[0].score if total_attempts > 0 else None
    best_score = max((a.score for a in attempts), default=None)

    attempt_responses = [
        QuizAttemptResponse(
            id=a.id,
            user_id=a.user_id,
            score=a.score,
            total_questions=a.total_questions,
            percentage=round((a.score / a.total_questions) * 100, 1) if a.total_questions > 0 else 0.0,
            attempted_at=a.attempted_at,
        )
        for a in attempts
    ]

    return QuizStatsResponse(
        total_attempts=total_attempts,
        latest_score=latest_score,
        best_score=best_score,
        attempts=attempt_responses,
    )
