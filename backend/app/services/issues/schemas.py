import uuid
from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class IssueOut(BaseModel):
    id:                  uuid.UUID
    repository_id:       uuid.UUID
    github_number:       int
    title:               str
    body:                Optional[str]
    html_url:            str
    state:               str
    labels:              list[str]
    difficulty:          str
    is_good_first_issue: bool
    is_help_wanted:      bool
    author:              Optional[str]
    created_at:          datetime

    model_config = {"from_attributes": True}


class IssueExplanationOut(BaseModel):
    id:               uuid.UUID
    issue_id:         uuid.UUID
    plain_english:    Optional[str]
    required_concepts:list[str] = []
    skills_needed:    list[str] = []
    files_involved:   list[str] = []
    suggested_steps:  Optional[str]
    created_at:       datetime

    model_config = {"from_attributes": True}
