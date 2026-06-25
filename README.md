# ClarityMed v3 — AI Medical Report Simplifier
### Python (FastAPI) backend · React (Vite) frontend

The Groq API key lives **only in `server/.env`** — the browser never sees it.

---

## Architecture

```
claritymed-v3/
├── server/                  ← Python / FastAPI (holds API key)
│   ├── main.py              ← FastAPI app entry point
│   ├── groq_client.py       ← Shared Groq API helper
│   ├── requirements.txt     ← Python dependencies
│   ├── .env.example         ← Copy to .env, add your key
│   └── routes/
│       ├── report.py        ← POST /api/report/simplify
│       ├── chat.py          ← POST /api/chat
│       ├── diet.py          ← POST /api/diet/generate
│       ├── actions.py       ← POST /api/actions/generate
│       └── audio.py         ← POST /api/audio/transcribe
└── client/                  ← React + Vite (zero API key)
    └── src/
        ├── utils/api.js     ← All fetch calls to /api/*
        └── components/
            ├── DietPlanner.jsx   ← 🥗 Personalised diet plan
            └── NextActions.jsx   ← 📋 Doctor/exercise/follow-up plan
```

---

## Features

- 🔬 **Report Simplification** — plain-language explanation of every lab result (Llama 3.3 70B)
- 🏷️ **Severity Badges** — Normal / Watch / Urgent per finding
- 🥗 **Diet Planner** — personalised meal plan based on actual lab results
- 📋 **Next Actions** — doctor visits, exercises, follow-up tests, warning signs
- 💬 **AI Chatbot** — ask follow-up questions about your report (Llama 3.1 8B)
- 🎤 **Voice Input** — speak questions, transcribed by Whisper Large V3
- 🔊 **Read Aloud** — TTS reads any result or summary aloud
- 📄 **Download PDF** — save a formatted simplified report
- 🌙 **Dark Mode** — full dark/light theme
- 📱 **Mobile Responsive** — works on all screen sizes

---

## Quick Start

### Step 1 — Get a free Groq API key
Go to [console.groq.com](https://console.groq.com) → Sign up → **API Keys** → Create key (`gsk_...`)

### Step 2 — Set up the Python server

```bash
cd server

# Copy the env file and add your key
cp .env.example .env
# Open .env and set: GROQ_API_KEY=gsk_your_key_here

# Create a virtual environment (recommended)
python -m venv .venv

# Activate it:
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

### Step 3 — Set up the React client

```bash
cd ../client
npm install
```

### Step 4 — Run both together

Open **two terminals**:

**Terminal 1 — Python server:**
```bash
cd server
source .venv/bin/activate   # (or .venv\Scripts\activate on Windows)
python main.py
# → Server running at http://localhost:3001
```

**Terminal 2 — React client:**
```bash
cd client
npm run dev
# → Client running at http://localhost:5173
```

Open **http://localhost:5173** — no API key prompt, just upload a PDF.

---

## Run with one command (optional)

From the root folder (requires Node installed for `concurrently`):

```bash
npm install           # installs concurrently
npm run dev           # starts both server and client
```

---

## Production Build

```bash
# Build React frontend
cd client && npm run build
# Output in client/dist/ — serve these static files via FastAPI or a CDN

# Run production server
cd ../server
python main.py        # remove --reload flag in main.py for production
```

---

## Python version

Requires **Python 3.11+**. Check with:
```bash
python --version
```

---

## Security

- `GROQ_API_KEY` is **only in `server/.env`** — never in the client code
- `.env` is in `.gitignore` — never committed to git
- No patient data is stored — all processing is done in-memory per request
