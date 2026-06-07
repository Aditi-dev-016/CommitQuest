import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class QuestOut(BaseModel):
    id:           uuid.UUID
    type:         str
    category:     str
    title:        str
    description:  Optional[str]
    difficulty:   str
    xp_reward:    int
    created_at:   datetime

    model_config = {"from_attributes": True}


class QuestProgressOut(BaseModel):
    id:             uuid.UUID
    contributor_id: uuid.UUID
    quest_id:       uuid.UUID
    status:         str
    pr_url:         Optional[str]
    completed_at:   Optional[datetime]
    xp_awarded:     Optional[int]
    created_at:     datetime

    model_config = {"from_attributes": True}
