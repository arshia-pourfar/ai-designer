from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from design_fetch import get_design_json
import json

app = FastAPI()

# ✅ اضافه کردن CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # یا ["http://localhost:3000"] اگر فرانت جدا داری
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Prompt(BaseModel):
    prompt: str

@app.post("/generate", response_class=JSONResponse)
async def generate(data: Prompt):
    design_json = await get_design_json(data.prompt)
    try:
        parsed = json.loads(design_json)
    except:
        parsed = []
    return JSONResponse(content=parsed)
