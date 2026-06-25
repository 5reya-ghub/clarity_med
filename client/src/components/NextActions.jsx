import React, { useState } from 'react'
import { api } from '../utils/api.js'

const CATEGORY_STYLES = {
  'Doctor Visit':      { bg: 'bg-blue-50 dark:bg-blue-950/30',   text: 'text-blue-700 dark:text-blue-300',   icon: '🩺', border: 'border-l-blue-400' },
  'Exercise':          { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700 dark:text-emerald-300', icon: '🏃', border: 'border-l-emerald-400' },
  'Lifestyle':         { bg: 'bg-purple-50 dark:bg-purple-950/30', text: 'text-purple-700 dark:text-purple-300', icon: '🌿', border: 'border-l-purple-400' },
  'Follow-up Test':    { bg: 'bg-amber-50 dark:bg-amber-950/30',  text: 'text-amber-700 dark:text-amber-300',  icon: '🧪', border: 'border-l-amber-400' },
  'Medication Review': { bg: 'bg-rose-50 dark:bg-rose-950/30',    text: 'text-rose-700 dark:text-rose-300',    icon: '💊', border: 'border-l-rose-400' },
  'Mental Health':     { bg: 'bg-teal-50 dark:bg-teal-950/30',    text: 'text-teal-700 dark:text-teal-300',    icon: '🧠', border: 'border-l-teal-400' },
}

const PRIORITY_BADGE = {
  High:   'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
  Medium: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  Low:    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

const URGENCY_CONFIG = {
  Immediate: { bg: 'bg-rose-600', text: '⚡ Immediate Action Needed' },
  Soon:      { bg: 'bg-amber-500', text: '⏰ Action Needed Soon' },
  Routine:   { bg: 'bg-emerald-500', text: '✅ Routine Follow-up' },
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="card p-5">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-48 mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      </div>
      {[1,2,3,4].map(i => (
        <div key={i} className="card p-4 border-l-4 border-l-slate-200 dark:border-l-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-40" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded-full w-14" />
          </div>
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-1" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </div>
      ))}
    </div>
  )
}

export default function NextActions({ reportData }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('actions')

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const result = await api.generateActions(reportData)
      setData(result)
    } catch (err) {
      setError(err.message || 'Failed to generate action plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) {
    return (
      <div className="card p-8 text-center fade-in">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">Your Action Plan</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          Get a prioritised plan — which doctor to visit, exercises to do, tests to repeat, and warning signs to watch for.
        </p>
        {error && <p className="text-rose-500 text-sm mb-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-4 py-2">{error}</p>}
        <button onClick={generate} className="btn-primary mx-auto">
          <span>✨</span> Generate My Action Plan
        </button>
      </div>
    )
  }

  if (loading) return <LoadingSkeleton />

  const urgency = URGENCY_CONFIG[data.urgencyLevel] || URGENCY_CONFIG.Routine

  const tabs = [
    { id: 'actions',   label: '📋 Actions' },
    { id: 'exercise',  label: '🏋️ Exercise' },
    { id: 'followup',  label: '🔁 Follow-ups' },
    { id: 'warnings',  label: '⚠️ Warnings' },
  ]

  return (
    <div className="space-y-4 fade-in">
      {/* Urgency banner */}
      <div className={`${urgency.bg} rounded-2xl px-5 py-4 text-white`}>
        <p className="font-display font-bold text-lg">{urgency.text}</p>
        <p className="text-sm mt-1 opacity-90">{data.urgencyReason}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-xs py-2 px-1 rounded-lg transition-all ${activeTab === t.id ? 'tab-active' : 'tab-inactive'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Actions tab */}
      {activeTab === 'actions' && (
        <div className="space-y-3 fade-in">
          {(data.actions || []).map(action => {
            const style = CATEGORY_STYLES[action.category] || CATEGORY_STYLES['Lifestyle']
            return (
              <div key={action.id} className={`card border-l-4 ${style.border} p-4`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{style.icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{action.title}</p>
                      <p className={`text-xs font-medium ${style.text}`}>{action.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_BADGE[action.priority] || PRIORITY_BADGE.Low}`}>
                      {action.priority}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2">{action.description}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    ⏱ {action.timeframe}
                  </span>
                  {(action.relatedFindings || []).map(f => (
                    <span key={f} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Exercise tab */}
      {activeTab === 'exercise' && (
        <div className="space-y-3 fade-in">
          {data.exercisePlan?.weeklyGoal && (
            <div className="card p-4 border-l-4 border-l-emerald-400">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Weekly Goal</p>
              <p className="font-semibold text-slate-800 dark:text-white">{data.exercisePlan.weeklyGoal}</p>
            </div>
          )}

          <div className="card p-4">
            <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
              <span>✅</span> Recommended Exercises
            </h4>
            <div className="space-y-3">
              {(data.exercisePlan?.recommended || []).map((ex, i) => (
                <div key={i} className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-3">
                  <span className="text-xl flex-shrink-0">🏃</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{ex.exercise}</p>
                    <div className="flex gap-3 mt-1 flex-wrap">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">⏱ {ex.duration}</span>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">📅 {ex.frequency}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{ex.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {(data.exercisePlan?.toAvoid || []).length > 0 && (
            <div className="card p-4">
              <h4 className="font-semibold text-sm text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
                <span>🚫</span> Exercises to Avoid
              </h4>
              <div className="space-y-2">
                {data.exercisePlan.toAvoid.map((ex, i) => (
                  <div key={i} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl p-3">
                    <span className="text-lg flex-shrink-0">⛔</span>
                    <div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-white">{ex.exercise}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{ex.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Follow-up tab */}
      {activeTab === 'followup' && (
        <div className="card p-4 fade-in">
          <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
            <span>🔁</span> Recommended Follow-up Tests
          </h4>
          <div className="space-y-2">
            {(data.followUpSchedule || []).map((item, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-slate-50 dark:border-slate-800 last:border-0 pb-3 last:pb-0">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-base">🧪</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{item.test}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">📅 {item.when}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warnings tab */}
      {activeTab === 'warnings' && (
        <div className="card p-4 fade-in">
          <h4 className="font-semibold text-sm text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
            <span>⚠️</span> Warning Signs to Watch For
          </h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">Seek medical attention promptly if you experience any of these:</p>
          <div className="space-y-2">
            {(data.warningSignsToWatch || []).map((sign, i) => (
              <div key={i} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl px-3 py-2.5">
                <span className="text-rose-500 font-bold text-sm flex-shrink-0 mt-0.5">!</span>
                <p className="text-sm text-slate-700 dark:text-slate-200">{sign}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
              🚨 If you experience a medical emergency, call your local emergency number immediately.
            </p>
          </div>
        </div>
      )}

      <button onClick={() => setData(null)}
        className="w-full text-xs text-slate-400 hover:text-clarity-600 py-2 transition-colors">
        ↺ Regenerate plan
      </button>
    </div>
  )
}
