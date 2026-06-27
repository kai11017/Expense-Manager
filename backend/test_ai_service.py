import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.services.ai_service import get_ai_chat_response

profile = {
    "monthly_income": 50000,
    "monthly_spending": 20000,
    "assets": [
        {"name": "Reliance", "type": "Stock", "current_value": 15000}
    ]
}

print(get_ai_chat_response(profile, "Hello Finny!"))
