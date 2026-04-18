import os
import base64
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
import google.generativeai as genai

router = APIRouter()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

class FoodAnalysisResponse(BaseModel):
    meal_name: str
    calories: int
    protein_g: int
    carbs_g: int
    fat_g: int
    health_score: int
    suggestion: str

@router.post("/api/analyze-food")
async def analyze_food(file: UploadFile = File(...)):
    contents = await file.read()
    
    prompt = """
    Analyze this food image. Respond ONLY in this exact JSON format, 
    no markdown, no extra text:
    {
      "meal_name": "...",
      "calories": 000,
      "protein_g": 00,
      "carbs_g": 00,
      "fat_g": 00,
      "health_score": 0,
      "suggestion": "..."
    }
    Estimate values realistically. Health score 1-10.
    """
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        image_part = {
            "mime_type": file.content_type,
            "data": contents
        }
        response = model.generate_content([prompt, image_part])
        import json
        clean_text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(clean_text)
        return data
    except Exception as e:
        return {"error": str(e)}
