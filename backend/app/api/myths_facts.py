from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.education import MythFact
from app.schemas.education import MythFactResponse

router = APIRouter(prefix="/myths-facts", tags=["Myths & Facts"])


@router.get("", response_model=List[MythFactResponse])
def get_all_myths_facts(db: Session = Depends(get_db)):
    """Retrieve all evidence-backed myth vs fact entries."""
    return db.query(MythFact).order_by(MythFact.id).all()
