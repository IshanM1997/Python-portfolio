from sqlalchemy import Column, Integer, DateTime
from sqlalchemy.sql import func
from database import Base

class LikeCounter(Base):
    __tablename__ = "like_counter"
    id         = Column(Integer, primary_key=True, index=True)
    count      = Column(Integer, default=0, nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
