from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.education import EducationalContent
from app.schemas.education import EducationalContentResponse

router = APIRouter(prefix="/education", tags=["Education"])


@router.get("", response_model=List[EducationalContentResponse])
def get_articles(
    category: Optional[str] = Query(None, description="Filter articles by category"),
    search: Optional[str] = Query(None, description="Search articles by title, description or keyword"),
    db: Session = Depends(get_db),
):
    """Retrieve educational articles, optionally filtered by category or search term."""
    query = db.query(EducationalContent)
    if category and category.strip() and category.strip().upper() != "ALL":
        query = query.filter(EducationalContent.category == category.strip())
    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (EducationalContent.title.ilike(term)) |
            (EducationalContent.short_description.ilike(term)) |
            (EducationalContent.content.ilike(term)) |
            (EducationalContent.category.ilike(term))
        )
    return query.order_by(EducationalContent.id).all()


@router.get("/categories/list")
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all categories and their article counts."""
    counts = (
        db.query(EducationalContent.category, func.count(EducationalContent.id))
        .group_by(EducationalContent.category)
        .all()
    )
    return [{"category": c[0], "count": c[1]} for c in counts]


@router.get("/{article_id}", response_model=EducationalContentResponse)
def get_article(article_id: int, db: Session = Depends(get_db)):
    """Retrieve a single educational article by ID."""
    article = db.query(EducationalContent).filter(EducationalContent.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Educational article not found."
        )
    return article


@router.get("/{article_id}/related", response_model=List[EducationalContentResponse])
def get_related_articles(article_id: int, limit: int = 3, db: Session = Depends(get_db)):
    """Retrieve related educational articles within the same category."""
    article = db.query(EducationalContent).filter(EducationalContent.id == article_id).first()
    if not article:
        raise HTTPException(status_code=404, detail="Educational article not found.")

    related = (
        db.query(EducationalContent)
        .filter(EducationalContent.id != article_id, EducationalContent.category == article.category)
        .order_by(EducationalContent.id)
        .limit(limit)
        .all()
    )

    if len(related) < limit:
        needed = limit - len(related)
        existing_ids = [r.id for r in related] + [article_id]
        more = (
            db.query(EducationalContent)
            .filter(EducationalContent.id.notin_(existing_ids))
            .order_by(EducationalContent.id)
            .limit(needed)
            .all()
        )
        related.extend(more)

    return related
