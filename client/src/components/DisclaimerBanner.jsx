import React, { useState } from 'react'
import { IconInfo, IconX } from './Icons.jsx'

export default function DisclaimerBanner() {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl px-4 py-3 flex items-start gap-3 no-print">
      <IconInfo className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed flex-1">
        <strong>Medical Disclaimer:</strong> ClarityMed is an informational tool only and does not constitute medical advice.
        Always consult a qualified healthcare professional regarding your test results and health decisions.
      </p>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 dark:hover:text-amber-200 flex-shrink-0"
      >
        <IconX className="w-4 h-4" />
      </button>
    </div>
  )
}
