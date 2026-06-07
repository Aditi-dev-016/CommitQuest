import uuid
from datetime import datetime, date
from sqlalchemy import BigInteger, String, Integer, Date, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class Contributor(Base):
    __tablename__ = "contributors"

    id:               Mapped[uuid.UUID]      = mapped_column(primary_key=True, default=uuid.uuid4)
    github_id:        Mapped[int]            = mapped_column(BigInteger, unique=True, nullable=False)
    username:         Mapped[str]            = mapped_column(String(64), unique=True, nullable=False)
    display_name:     Mapped[str | None]     = mapped_column(String(128))
    email:            Mapped[str | None]     = mapped_column(String(255))
    avatar_url:       Mapped[str | None]     = mapped_column(String(512))
    bio:              Mapped[str | None]     = mapped_column(String(1024))
    github_url:       Mapped[str | None]     = mapped_column(String(512))
    experience_level: Mapped[str | None]     = mapped_column(String(32))
    total_xp:         Mapped[int]            = mapped_column(Integer, default=0, nullable=False)
    current_level:    Mapped[int]            = mapped_column(Integer, default=1, nullable=False)
    streak_count:     Mapped[int]            = mapped_column(Integer, default=0, nullable=False)
    last_active_date: Mapped[date | None]    = mapped_column(Date)
    created_at:       Mapped[datetime]       = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at:       Mapped[datetime]       = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
