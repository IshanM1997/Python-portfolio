from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api", tags=["likes"])

def _get_or_create_counter(db: Session) -> models.LikeCounter:
    record = db.query(models.LikeCounter).first()
    if not record:
        record = models.LikeCounter(count=0)
        db.add(record)
        db.commit()
        db.refresh(record)
    return record

@router.get("/likes", response_model=schemas.LikeResponse)
def get_likes(db: Session = Depends(get_db)):
    return _get_or_create_counter(db)

@router.post("/likes", response_model=schemas.LikeResponse)
def add_like(db: Session = Depends(get_db)):
    record = _get_or_create_counter(db)
    record.count += 1
    db.commit()
    db.refresh(record)
    return record
