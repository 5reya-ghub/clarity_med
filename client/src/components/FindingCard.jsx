import React, { useState } from 'react'
import { IconChevronDown, IconVolume, IconVolumeOff, IconMessageCircle } from './Icons.jsx'
import { speak, stopSpeaking } from '../utils/tts.js'

const SEVERITY_CONFIG = {
  Normal: {
    badge: 'badge-normal',
    dot: 'bg-emerald-500',
    border: 'border-l-emerald-400',
    label: '● Normal',
  },
  Watch: {
    badge: 'badge-watch',
    dot: 'bg-amber-500',
    border: 'border-l-amber-400',
    label: '▲ Watch',
  },
  Urgent: {
    badge: 'badge-urgent',
    dot: 'bg-rose-500',
    border: 'border-l-rose-500',
    label: '! Urgent',
  },
}

export default function FindingCard({ finding, onAskChatbot, globalSpeaking, setGlobalSpeaking }) {
  const [expanded, setExpanded] = useState(finding.severity !== 'Normal')
  const [speaking, setSpeaking] = useState(false)

  const sc = SEVERITY_CONFIG[finding.severity] || SEVERITY_CONFIG.Normal

  const handleSpeak = (e) => {
    e.stopPropagation()
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
      setGlobalSpeaking(false)
    } else {
      if (globalSpeaking) stopSpeaking()
      setGlobalSpeaking(true)
      setSpeaking(true)
      const text = `${finding.test}${finding.abbreviation ? ', ' + finding.abbreviation : ''}. 
        Your value is ${finding.value}. Reference range: ${finding.referenceRange}. 
        ${finding.plainExplanation} ${finding.whatItMeans || ''}`
      speak(text, {
        onEnd: () => { setSpeaking(false); setGlobalSpeaking(false) },
        onError: () => { setSpeaking(false); setGlobalSpeaking(false) },
      })
    }
  }

  return (
    <div className={`card border-l-4 ${sc.border} overflow-hidden transition-shadow hover:shadow-md`}>
      {/* Header row — always visible */}
      <button
        className="w-full text-left p-4 flex items-start gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <span className="font-semibold text-slate-800 dark:text-slate-100">{finding.test}</span>
            {finding.abbreviation && (
              <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">({finding.abbreviation})</span>
            )}
            <span className={sc.badge}>{sc.label}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">{finding.value}</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-400 dark:text-slate-500">Range: {finding.referenceRange}</span>
          </div>
        </div>
        <IconChevronDown
          className={`w-4 h-4 text-slate-400 mt-1 flex-shrink-0 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800 pt-3 space-y-3">
          {/* Abbreviation meaning */}
          {finding.abbreviationMeaning && (
            <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              <span className="font-mono">{finding.abbreviation}</span> = {finding.abbreviationMeaning}
            </div>
          )}

          {/* Plain explanation */}
          {finding.plainExplanation && (
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {finding.plainExplanation}
            </p>
          )}

          {/* What it means */}
          {finding.whatItMeans && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">What this means for you</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{finding.whatItMeans}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleSpeak}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-medium"
            >
              {speaking ? <IconVolumeOff className="w-3.5 h-3.5" /> : <IconVolume className="w-3.5 h-3.5" />}
              {speaking ? 'Stop' : 'Read aloud'}
            </button>

            {finding.suggestedQuestion && (
              <button
                onClick={() => onAskChatbot(finding.suggestedQuestion)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-clarity-50 dark:bg-clarity-950/40 text-clarity-700 dark:text-clarity-300 hover:bg-clarity-100 dark:hover:bg-clarity-900/40 transition-colors font-medium"
              >
                <IconMessageCircle className="w-3.5 h-3.5" />
                Ask chatbot
              </button>
            )}
          </div>

          {/* Suggested question */}
          {finding.suggestedQuestion && (
            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
              💬 Ask your doctor: "{finding.suggestedQuestion}"
            </p>
          )}
        </div>
      )}
    </div>
  )
}
