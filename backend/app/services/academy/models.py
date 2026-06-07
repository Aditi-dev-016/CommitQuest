import uuid
from datetime import datetime
from sqlalchemy import String, Integer, SmallInteger, DateTime, Text, func, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id:          Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug:        Mapped[str]       = mapped_column(String(64), unique=True, nullable=False)
    title:       Mapped[str]       = mapped_column(String(128), nullable=False)
    description: Mapped[str|None]  = mapped_column(Text)
    region:      Mapped[str|None]  = mapped_column(String(64))
    order_index: Mapped[int]       = mapped_column(SmallInteger, default=0)
    created_at:  Mapped[datetime]  = mapped_column(DateTime(timezone=True), server_default=func.now())


class Lesson(Base):
    __tablename__ = "lessons"

    id:            Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    path_id:       Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("learning_paths.id", ondelete="CASCADE"), nullable=False)
    title:         Mapped[str]       = mapped_column(String(256), nullable=False)
    type:          Mapped[str]       = mapped_column(String(16), default="article")   # article|video|quiz
    content:       Mapped[str|None]  = mapped_column(Text)
    quiz_data:     Mapped[dict|None] = mapped_column(JSONB)
    xp_reward:     Mapped[int]       = mapped_column(Integer, default=20)
    order_index:   Mapped[int]       = mapped_column(SmallInteger, nullable=False)
    duration_mins: Mapped[int]       = mapped_column(SmallInteger, default=15)
    created_at:    Mapped[datetime]  = mapped_column(DateTime(timezone=True), server_default=func.now())


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    contributor_id: Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), nullable=False, primary_key=True)
    lesson_id:      Mapped[uuid.UUID]     = mapped_column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), primary_key=True)
    completed_at:   Mapped[datetime|None] = mapped_column(DateTime(timezone=True))
    quiz_score:     Mapped[int|None]      = mapped_column(SmallInteger)
    xp_awarded:     Mapped[int|None]      = mapped_column(Integer)
