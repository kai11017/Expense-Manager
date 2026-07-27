import os
from celery import Celery
from dotenv import load_dotenv

load_dotenv()

redis_url = os.getenv("AZURE_REDIS_URL") or os.getenv("REDIS_URL", "redis://finpilot-redis:6379/0")

celery_app = Celery(
    "finpilot_worker",
    broker=redis_url,
    backend=redis_url,
    include=["app.tasks"]
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)
