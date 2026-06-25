import React, { useState } from 'react'
import { api } from '../utils/api.js'

const MEAL_ICONS = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' }
const MEAL_LABELS = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' }

function LoadingSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="card p-5">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3 mb-3" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      </div>
      {[1,2,3].map(i => (
        <div key={i} className="card p-5 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
      ))}
    </div>
  )
}

export default function DietPlanner({ reportData }) {
  const [diet, setDiet] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('meals')

  const generate = async () => {
    setLoading(true); setError('')
    try {
      const data = await api.generateDiet(reportData)
      setDiet(data)
    } catch (err) {
      setError(err.message || 'Failed to generate diet plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!diet && !loading) {
    return (
      <div className="card p-8 text-center fade-in">
        <div className="text-5xl mb-4">🥗</div>
        <h3 className="font-display font-bold text-xl text-slate-800 dark:text-white mb-2">Personalised Diet Plan</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
          Get a diet plan tailored specifically to your lab results — what to eat, what to avoid, and why.
        </p>
        {error && <p className="text-rose-500 text-sm mb-4 bg-rose-50 dark:bg-rose-950/30 rounded-xl px-4 py-2">{error}</p>}
        <button onClick={generate} className="btn-primary mx-auto">
          <span>✨</span> Generate My Diet Plan
        </button>
      </div>
    )
  }

  if (loading) return <LoadingSkeleton />

  const tabs = [
    { id: 'meals', label: '🍽️ Daily Meals' },
    { id: 'eat', label: '✅ Eat More' },
    { id: 'avoid', label: '🚫 Avoid' },
  ]

  return (
    <div className="space-y-4 fade-in">
      {/* Headline card */}
      <div className="card p-5 border-l-4 border-l-emerald-400">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Your Personalised Plan</p>
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">{diet.headline}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{diet.rationale}</p>
          </div>
          <span className="text-3xl flex-shrink-0">🥗</span>
        </div>
        {diet.hydration && (
          <div className="mt-3 flex items-start gap-2 bg-blue-50 dark:bg-blue-950/30 rounded-xl px-3 py-2.5">
            <span className="text-base">💧</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{diet.hydration}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 text-xs py-2 px-2 rounded-lg transition-all ${activeTab === t.id ? 'tab-active' : 'tab-inactive'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Meals tab */}
      {activeTab === 'meals' && (
        <div className="space-y-3 fade-in">
          {Object.entries(diet.dailyMeals || {}).map(([meal, items]) => (
            <div key={meal} className="card p-4">
              <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
                <span>{MEAL_ICONS[meal]}</span> {MEAL_LABELS[meal]}
              </h4>
              <div className="space-y-2">
                {(items || []).map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0 mt-2" />
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.item}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {diet.weeklyMealIdea && (
            <div className="card p-4 border border-dashed border-clarity-300 dark:border-clarity-700">
              <p className="text-xs font-semibold text-clarity-600 dark:text-clarity-400 mb-1">💡 Weekly Meal Prep Idea</p>
              <p className="text-sm text-slate-600 dark:text-slate-300">{diet.weeklyMealIdea}</p>
            </div>
          )}
        </div>
      )}

      {/* Eat more tab */}
      {activeTab === 'eat' && (
        <div className="card p-4 fade-in">
          <h4 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-2">
            <span>✅</span> Foods to Eat More Of
          </h4>
          <div className="space-y-2">
            {(diet.foodsToEat || []).map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl px-3 py-2.5">
                <span className="text-emerald-500 font-bold text-sm flex-shrink-0 mt-0.5">+</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{f.food}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Avoid tab */}
      {activeTab === 'avoid' && (
        <div className="card p-4 fade-in">
          <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-3 flex items-center gap-2">
            <span>🚫</span> Foods to Avoid
          </h4>
          <div className="space-y-2">
            {(diet.foodsToAvoid || []).map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl px-3 py-2.5">
                <span className="text-rose-500 font-bold text-sm flex-shrink-0 mt-0.5">–</span>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{f.food}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{f.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={() => setDiet(null)}
        className="w-full text-xs text-slate-400 hover:text-clarity-600 py-2 transition-colors">
        ↺ Regenerate plan
      </button>
    </div>
  )
}
