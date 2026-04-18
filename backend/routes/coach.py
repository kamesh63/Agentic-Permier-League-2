import os
from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai

router = APIRouter()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

class CoachRequest(BaseModel):
    trigger: str
    context: dict

@router.post("/api/coach-message")
async def get_coach_message(req: CoachRequest):
    prompt = f"""
    Act as a high-tech AI fitness assistant. 
    Event: {req.trigger}
    User Context: {req.context}
    Give a short, punchy, 1-2 sentence coaching or motivational message.
    """
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return {"message": response.text.strip()}
    except Exception as e:
        return {"message": "System error. Manual override required. Proceed with workout.", "error": str(e)}
