import React, { useState, useRef, useEffect } from 'react'
import { IconSend, IconMic, IconMicOff, IconMessageCircle, IconRefresh } from './Icons.jsx'
import { api } from '../utils/api.js'
import { VoiceRecorder } from '../utils/voiceRecorder.js'

const QUICK_QUESTIONS = [
  'What should I watch out for?',
  'Which results need attention?',
  'What should I tell my doctor?',
  'Is anything critically urgent?',
]

export default function ChatPanel({ reportContext }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your ClarityMed assistant. I've read your report and I'm here to help. What would you like to know?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [recording, setRecording] = useState(false)
  const [error, setError] = useState('')
  const recorderRef = useRef(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText) return
    setInput(''); setError('')
    const updatedMessages = [...messages, { role: 'user', content: userText }]
    setMessages(updatedMessages)
    setLoading(true)
    try {
      const history = updatedMessages.slice(1).map(({ role, content }) => ({ role, content }))
      const { reply } = await api.chat(reportContext, history.slice(0, -1), userText)
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setError('Could not get a response. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const startRecording = async () => {
    try {
      recorderRef.current = new VoiceRecorder()
      await recorderRef.current.start()
      setRecording(true)
    } catch {
      setError('Microphone access denied.')
    }
  }

  const stopRecording = async () => {
    if (!recorderRef.current) return
    setRecording(false); setLoading(true)
    try {
      const blob = await recorderRef.current.stop()
      const { text } = await api.transcribeAudio(blob)
      if (text) sendMessage(text)
      else setLoading(false)
    } catch {
      setError('Voice transcription failed. Please type instead.')
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you with your report?' }])
    setError('')
  }

  return (
    <div className="card flex flex-col h-[580px] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-clarity-100 dark:bg-clarity-950 rounded-lg flex items-center justify-center">
            <IconMessageCircle className="w-4 h-4 text-clarity-600" />
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">Report Assistant</p>
            <p className="text-xs text-slate-400">Ask anything about your results</p>
          </div>
        </div>
        <button onClick={clearChat} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Clear">
          <IconRefresh className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-clarity-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-bl-sm'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 150, 300].map(d => <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
              </div>
            </div>
          </div>
        )}
        {error && <div className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-3 py-2">{error}</div>}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      <div className="px-4 py-2 border-t border-slate-50 dark:border-slate-800 flex gap-1.5 overflow-x-auto">
        {QUICK_QUESTIONS.map(q => (
          <button key={q} onClick={() => sendMessage(q)} disabled={loading}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-clarity-50 dark:hover:bg-clarity-950/40 hover:text-clarity-700 dark:hover:text-clarity-300 transition-colors disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask about any result…" disabled={loading || recording}
            className="flex-1 bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none disabled:opacity-50" />
          <button onClick={recording ? stopRecording : startRecording} disabled={loading}
            className={`p-1.5 rounded-lg transition-colors ${recording ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-600 animate-pulse' : 'text-slate-400 hover:text-clarity-600 hover:bg-clarity-50 dark:hover:bg-clarity-950/40'}`}>
            {recording ? <IconMicOff className="w-4 h-4" /> : <IconMic className="w-4 h-4" />}
          </button>
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            className="p-1.5 rounded-lg bg-clarity-600 hover:bg-clarity-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <IconSend className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-300 dark:text-slate-600 mt-1.5 text-center">Not medical advice — always consult your doctor</p>
      </div>
    </div>
  )
}
