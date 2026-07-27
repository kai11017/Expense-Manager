import time
from app.core.celery_app import celery_app

@celery_app.task(name="send_otp_email_task")
def send_otp_email_task(email: str, otp_code: str, otp_type: str):
    """
    Simulate sending an email in the background.
    """
    time.sleep(2)  # Simulate network latency
    print(f"\n\n====== OTP REQUEST (VIA CELERY) ======")
    print(f"Email: {email}")
    print(f"Type: {otp_type}")
    print(f"OTP Code: {otp_code}")
    print(f"========================================\n\n")
    return True
