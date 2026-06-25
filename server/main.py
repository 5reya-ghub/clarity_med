"""ClarityMed — Python/FastAPI backend server."""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.report import router as report_router
from routes.chat import router as chat_router
from routes.diet import router as diet_router
from routes.actions import router as actions_router
from routes.audio import router as audio_router

load_dotenv()

app = FastAPI(title="ClarityMed API", version="3.0.0")

# ── CORS — allow the Vite dev server ────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ───────────────────────────────────────────────────────────────────
app.include_router(report_router, prefix="/api/report")
app.include_router(chat_router,   prefix="/api/chat")
app.include_router(diet_router,   prefix="/api/diet")
app.include_router(actions_router, prefix="/api/actions")
app.include_router(audio_router,  prefix="/api/audio")


@app.get("/api/health")
async def health():
    key_ok = bool(os.getenv("GROQ_API_KEY")) and "your_groq" not in os.getenv("GROQ_API_KEY", "")
    return {"status": "ok", "service": "ClarityMed API", "groq_key_set": key_ok}


# ── Dev entry point ──────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    print(f"[OK] ClarityMed server running on http://localhost:{port}")
    if not os.getenv("GROQ_API_KEY") or "your_groq" in os.getenv("GROQ_API_KEY", ""):
        print("[WARNING] GROQ_API_KEY not set — copy server/.env.example to server/.env and add your key")
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
