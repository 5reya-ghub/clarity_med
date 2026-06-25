import os
import httpx
from fastapi import APIRouter, UploadFile, File, HTTPException

router = APIRouter()


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    api_key = os.getenv("GROQ_API_KEY", "")
    if not api_key or "your_groq" in api_key:
        raise HTTPException(status_code=500, detail="GROQ_API_KEY not configured")

    audio_bytes = await file.read()
    if len(audio_bytes) > 25 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Audio file too large (max 25 MB)")

    async with httpx.AsyncClient(timeout=60) as client:
        resp = await client.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            headers={"Authorization": f"Bearer {api_key}"},
            files={"file": (file.filename or "audio.webm", audio_bytes, file.content_type or "audio/webm")},
            data={"model": "whisper-large-v3"},
        )

    if not resp.is_success:
        detail = resp.json().get("error", {}).get("message", "Transcription failed")
        raise HTTPException(status_code=502, detail=detail)

    return {"text": resp.json().get("text", "")}
