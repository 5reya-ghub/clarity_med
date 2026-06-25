import React from 'react'
import { IconMoon, IconSun } from './Icons.jsx'

export default function Header({ darkMode, onToggleDark, hasReport, onReset }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button
          onClick={hasReport ? onReset : undefined}
          className="flex items-center gap-2.5 group"
          title={hasReport ? 'Start over' : ''}
        >
          <div className="w-8 h-8 bg-clarity-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-clarity-700 transition-colors">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
            Clarity<span className="text-clarity-600">Med</span>
          </span>
        </button>

        <div className="flex items-center gap-2">
          {hasReport && (
            <button onClick={onReset} className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium">
              New Report
            </button>
          )}
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  )
}
