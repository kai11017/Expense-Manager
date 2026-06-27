import os
import google.generativeai as genai

api_key = os.getenv("GEMINI_API_KEY", "")
genai.configure(api_key=api_key)

try:
    model = genai.GenerativeModel("gemini-3.5-flash")
    response = model.generate_content("Hello")
    print("SUCCESS:", response.text)
except Exception as e:
    import traceback
    print("ERROR:")
    traceback.print_exc()
