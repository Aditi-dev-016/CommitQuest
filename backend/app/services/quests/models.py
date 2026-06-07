import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Quest(Base):
    __tablename__ = "quests"

    id:              Mapped[uuid.UUID]      = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    type:            Mapped[str]            = mapped_column(String(32), nullable=False)   # daily|standard|featured|milestone
    category:        Mapped[str]            = mapped_column(String(32), nullable=False)   # explore|read|code|review|community
    title:           Mapped[str]            = mapped_column(String(256), nullable=False)
    description:     Mapped[str | None]     = mapped_column(String(2048))
    difficulty:      Mapped[str]            = mapped_column(String(16), default="easy")   # easy|medium|hard
    xp_reward:       Mapped[int]            = mapped_column(Integer, default=0)
    prerequisite_id: Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), ForeignKey("quests.id"), nullable=True)
    issue_id:        Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), nullable=True)
    repository_id:   Mapped[uuid.UUID|None] = mapped_column(UUID(as_uuid=True), nullable=True)
    active_from:     Mapped[datetime|None]  = mapped_column(DateTime(timezone=True))
    active_until:    Mapped[datetime|None]  = mapped_column(DateTime(timezone=True))
    created_at:      Mapped[datetime]       = mapped_column(DateTime(timezone=True), server_default=func.now())


class QuestProgress(Base):
    __tablename__ = "quest_progress"

    id:             Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contributor_id: Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    quest_id:       Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), ForeignKey("quests.id"), nullable=False)
    status:         Mapped[str]           = mapped_column(String(32), default="available")
    pr_url:         Mapped[str|None]      = mapped_column(String(512))
    completed_at:   Mapped[datetime|None] = mapped_column(DateTime(timezone=True))
    xp_awarded:     Mapped[int|None]      = mapped_column(Integer)
    created_at:     Mapped[datetime]      = mapped_column(DateTime(timezone=True), server_default=func.now())
