from celery import Celery
from app.config import settings

celery = Celery(
    "contribquest",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=[
        "app.services.repository.tasks",
        "app.services.quests.daily_refresh",
    ],
)

celery.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "refresh-daily-quests": {
            "task": "app.services.quests.daily_refresh.refresh_daily_quests",
            "schedule": 86400.0,  # every 24h
        },
    },
)
