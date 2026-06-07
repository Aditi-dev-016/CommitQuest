import uuid
from datetime import datetime
from sqlalchemy import String, Integer, DateTime, func
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class ContributionHistory(Base):
    __tablename__ = "contribution_history"

    id:             Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    contributor_id: Mapped[uuid.UUID]  = mapped_column(UUID(as_uuid=True), nullable=False, index=True)
    event_type:     Mapped[str]        = mapped_column(String(64), nullable=False)
    xp_earned:      Mapped[int]        = mapped_column(Integer, default=0)
    metadata_:      Mapped[dict]       = mapped_column("metadata", JSONB, default=dict)
    occurred_at:    Mapped[datetime]   = mapped_column(DateTime(timezone=True), server_default=func.now())
