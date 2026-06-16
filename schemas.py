from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class LikeResponse(BaseModel):
    count: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
