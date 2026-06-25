from fastapi import APIRouter
from pydantic import BaseModel
from groq_client import groq_chat

router = APIRouter()


class ChatRequest(BaseModel):
    reportContext: str
    conversationHistory: list[dict] = []
    userMessage: str


@router.post("")
async def chat(body: ChatRequest):
    if not body.userMessage.strip():
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="userMessage is required")

    system_prompt = f"""You are ClarityMed's patient support assistant — warm, clear, and knowledgeable. Help patients understand their specific medical report.

Patient's simplified report context:
{body.reportContext or 'No report context provided.'}

Guidelines:
- Answer questions about this specific report in plain, friendly language
- Explain medical terms simply when they come up
- For Watch or Urgent findings, acknowledge concern gently without causing panic
- Always recommend consulting their doctor for clinical decisions, treatment, or medication changes
- If asked in another language, respond in that language
- Keep answers concise (3-5 sentences) unless more detail is genuinely needed
- Never diagnose or prescribe — you are an information aide, not a physician"""

    messages = [
        {"role": "system", "content": system_prompt},
        *body.conversationHistory,
        {"role": "user", "content": body.userMessage},
    ]

    reply = await groq_chat(
        model="llama-3.1-8b-instant",
        messages=messages,
        temperature=0.5,
        max_tokens=1024,
    )
    return {"reply": reply}
