import uuid
from datetime import datetime, date
from pydantic import BaseModel
from typing import Optional


class ContributorOut(BaseModel):
    id:               uuid.UUID
    github_id:        int
    username:         str
    display_name:     Optional[str]
    avatar_url:       Optional[str]
    bio:              Optional[str]
    experience_level: Optional[str]
    total_xp:         int
    current_level:    int
    streak_count:     int
    last_active_date: Optional[date]
    created_at:       datetime

    model_config = {"from_attributes": True}


class ContributorUpdate(BaseModel):
    display_name: Optional[str] = None
    bio:          Optional[str] = None
