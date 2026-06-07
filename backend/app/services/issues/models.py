import uuid
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, func, Text
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Issue(Base):
    __tablename__ = "issues"

    id:                 Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    repository_id:      Mapped[uuid.UUID]    = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    github_number:      Mapped[int]
    title:              Mapped[str]          = mapped_column(String(512), nullable=False)
    body:               Mapped[str | None]   = mapped_column(Text)
    html_url:           Mapped[str]          = mapped_column(String(512))
    state:              Mapped[str]          = mapped_column(String(16), default="open")
    labels:             Mapped[list]         = mapped_column(ARRAY(String(64)), default=list)
    difficulty:         Mapped[str]          = mapped_column(String(16), default="unknown")
    is_good_first_issue:Mapped[bool]         = mapped_column(Boolean, default=False)
    is_help_wanted:     Mapped[bool]         = mapped_column(Boolean, default=False)
    author:             Mapped[str | None]   = mapped_column(String(128))
    created_at:         Mapped[datetime]     = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at:         Mapped[datetime]     = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class IssueAnalysis(Base):
    __tablename__ = "issue_analyses"

    id:              Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    issue_id:        Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    plain_english:   Mapped[str | None] = mapped_column(Text)
    required_concepts: Mapped[list]    = mapped_column(ARRAY(String(128)), default=list)
    skills_needed:   Mapped[list]      = mapped_column(ARRAY(String(64)), default=list)
    files_involved:  Mapped[list]      = mapped_column(ARRAY(String(512)), default=list)
    suggested_steps: Mapped[str | None]= mapped_column(Text)
    created_at:      Mapped[datetime]  = mapped_column(DateTime(timezone=True), server_default=func.now())
