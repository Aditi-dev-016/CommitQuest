import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class LearningPathOut(BaseModel):
    id:          uuid.UUID
    slug:        str
    title:       str
    description: Optional[str]
    region:      Optional[str]
    order_index: int

    model_config = {"from_attributes": True}


class LessonOut(BaseModel):
    id:            uuid.UUID
    path_id:       uuid.UUID
    title:         str
    type:          str
    xp_reward:     int
    order_index:   int
    duration_mins: int
    completed_at:  Optional[datetime] = None

    model_config = {"from_attributes": True}
