// All API calls go to our own Express backend — no Groq key in the frontend

const BASE = '/api'

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Request failed: ${res.status}`)
  }
  return res.json()
}

export const api = {
  simplifyReport: (reportText) =>
    post('/report/simplify', { reportText }),

  chat: (reportContext, conversationHistory, userMessage) =>
    post('/chat', { reportContext, conversationHistory, userMessage }),

  generateDiet: (reportData) =>
    post('/diet/generate', { reportData }),

  generateActions: (reportData) =>
    post('/actions/generate', { reportData }),

  transcribeAudio: async (audioBlob) => {
    const form = new FormData()
    form.append('file', audioBlob, 'audio.webm')
    const res = await fetch(`${BASE}/audio/transcribe`, { method: 'POST', body: form })
    if (!res.ok) throw new Error('Transcription failed')
    return res.json()
  },
}
