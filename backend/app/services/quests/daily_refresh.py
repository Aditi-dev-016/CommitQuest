from app.celery_app import celery


@celery.task(name="app.services.quests.daily_refresh.refresh_daily_quests")
def refresh_daily_quests():
    """Rotate daily challenge quests at midnight UTC."""
    # TODO: Archive expired daily quests, generate new ones
    pass
