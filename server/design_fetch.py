import os
import re
import json
import httpx
from dotenv import load_dotenv

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if not GOOGLE_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY یافت نشد. کلید Gemini را در فایل .env قرار دهید.")

GEMINI_ENDPOINT = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "gemini-2.0-flash:generateContent"
)

# --- system prompt دقیقا مطابق متن شما ---
SYSTEM_PROMPT = (
    "You are a professional design robot whose output is only a JSON array compatible with Fabric.js. "
    "The user gives a simple instruction such as 'create a signup form' or 'design a login button', and you must transform it into a modern, beautiful, and usable user interface. "
    "Designs should follow current UI/UX trends, with appropriate colors, logical spacing, and use features such as borders, borderRadius, shadows, readable fonts, and organized layouts. "
    "The output must only be a JSON array, with no additional text or explanation. "
    "Usable elements include: 'rect', 'text', 'button', 'input'. You can combine multiple shapes if needed to create more complex components. "
    "The properties of each shape are as follows:\n"
    "- rect: type, left, top, width, height, fill, stroke (optional), rx (for corners)\n"
    "- text: type, left, top, text, fontSize, fill, fontFamily (optional), fontWeight (optional)\n"
    "- button: type, left, top, width, height, fill, text, fontSize, textColor, borderRadius (optional), shadow (optional)\n"
    "- input: type='rect', left, top, width, height, fill='white', stroke='black', rx (optional)\n"
    "Automatically and intelligently position the shapes so they do not overlap, have logical spacing, and are neatly arranged. "
    "Use grids or logical layouts if necessary. "
    "For forms, follow a logical order of fields (e.g., name, email, password, submit button). "
    "Use colors appropriate to their purpose (e.g., submit buttons in blue or green, warnings in red). "
    "If the instruction is insufficient, use professional default designs. "
    "Your goal is to create a beautiful, usable, and extendable user interface that can be easily rendered in Fabric.js."
)

def _extract_json_array(text: str) -> str:
    """
    از متن مدل، آرایه JSON را بیرون می‌کشد:
    - حذف بلاک‌های ```json ... ```
    - اگر هنوز JSON نبود، اولین آرایه [ ... ] را با regex می‌گیرد
    """
    if not text:
        return "[]"

    # حذف کد بلاک‌ها (```json ... ``` یا ``` ... ```)
    text = re.sub(r"```(?:json)?\s*(.*?)\s*```", r"\1", text, flags=re.DOTALL | re.IGNORECASE).strip()

    # اگر مستقیم JSON معتبر بود
    try:
        parsed = json.loads(text)
        if isinstance(parsed, list):
            return json.dumps(parsed, ensure_ascii=False)
    except Exception:
        pass

    # تلاش: اولین آرایه‌ی [ ... ] را پیدا کن
    m = re.search(r"\[\s*[\s\S]*\s*\]", text)
    if m:
        candidate = m.group(0)
        try:
            parsed = json.loads(candidate)
            if isinstance(parsed, list):
                return json.dumps(parsed, ensure_ascii=False)
        except Exception:
            pass

    return "[]"

async def get_design_json(prompt: str) -> str:
    """
    مستقیماً به Gemini (v1beta) درخواست می‌زند و فقط یک آرایه JSON برمی‌گرداند.
    """
    payload = {
        # سیستم‌پرومپت رسمی Gemini
        "systemInstruction": {
            "role": "system",
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        # پیام کاربر
        "contents": [
            {
                "role": "user",
                "parts": [{"text": prompt}]
            }
        ],
        # وادار کردن مدل به خروجی JSON
        "generationConfig": {
            "temperature": 0.2,
            "top_p": 0.9,
            "top_k": 40,
            # "max_output_tokens": 2048,
            "response_mime_type": "application/json"
        }
        # در صورت نیاز می‌توان safetySettings اضافه کرد
    }

    url = f"{GEMINI_ENDPOINT}?key={GOOGLE_API_KEY}"

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(url, headers={"Content-Type": "application/json"}, json=payload)

    try:
        data = resp.json()
    except Exception:
        # اگر پاسخ JSON نبود
        return json.dumps([{
            "type": "rect", "left": 50, "top": 50, "width": 120, "height": 48, "fill": "#f44336"
        }], ensure_ascii=False)

    # مدیریت خطاهای API
    if "error" in data:
        # خطا را لاگ کن و یک fallback کوچک برگردان
        err = data["error"]
        print("GEMINI ERROR:", err)
        return json.dumps([{
            "type": "rect", "left": 50, "top": 50, "width": 120, "height": 48, "fill": "#f44336"
        }], ensure_ascii=False)

    # استخراج متن خروجی
    # candidates[0].content.parts[*].text
    text_blocks = []
    for c in data.get("candidates", []):
        content = c.get("content", {})
        for part in content.get("parts", []):
            if "text" in part and isinstance(part["text"], str):
                text_blocks.append(part["text"])

    combined = "\n".join(text_blocks).strip()
    json_str = _extract_json_array(combined)

    # نهایی: اگر همچنان خالی بود، fallback
    try:
        parsed = json.loads(json_str)
        if not isinstance(parsed, list):
            raise ValueError("Output is not a list")
    except Exception:
        parsed = [{
            "type": "rect", "left": 50, "top": 50, "width": 120, "height": 48, "fill": "#f44336"
        }]

    return json.dumps(parsed, ensure_ascii=False)
