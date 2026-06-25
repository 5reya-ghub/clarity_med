import React from 'react'
import { IconInfo, IconDownload, IconPrinter, IconVolume, IconVolumeOff } from './Icons.jsx'
import { speak, stopSpeaking } from '../utils/tts.js'

export default function SummaryCard({ data, onDownloadPDF, speaking, setSpeaking }) {
  const urgentCount = data.findings.filter(f => f.severity === 'Urgent').length
  const watchCount  = data.findings.filter(f => f.severity === 'Watch').length
  const normalCount = data.findings.filter(f => f.severity === 'Normal').length

  const handleSpeak = () => {
    if (speaking) {
      stopSpeaking()
      setSpeaking(false)
    } else {
      setSpeaking(true)
      const text = `${data.reportType ? data.reportType + '. ' : ''}Summary: ${data.summary}`
      speak(text, {
        onEnd: () => setSpeaking(false),
        onError: () => setSpeaking(false),
      })
    }
  }

  return (
    <div className="card p-6 bg-gradient-to-br from-clarity-600 to-clarity-700 text-white border-0 shadow-lg shadow-clarity-200 dark:shadow-clarity-900/30">
      {/* Report metadata */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          {data.reportType && (
            <span className="text-clarity-200 text-xs font-semibold uppercase tracking-wider">{data.reportType}</span>
          )}
          <h2 className="font-display font-bold text-xl mt-0.5">
            {data.patientName ? `${data.patientName}'s Results` : 'Your Results'}
          </h2>
          {data.reportDate && (
            <p className="text-clarity-200 text-sm mt-0.5">{data.reportDate}</p>
          )}
        </div>

        {/* Severity counts */}
        <div className="flex gap-2 flex-shrink-0">
          {urgentCount > 0 && (
            <div className="bg-rose-500/80 rounded-lg px-2.5 py-1.5 text-center min-w-[40px]">
              <div className="font-bold text-lg leading-none">{urgentCount}</div>
              <div className="text-xs opacity-80 mt-0.5">Urgent</div>
            </div>
          )}
          {watchCount > 0 && (
            <div className="bg-amber-500/80 rounded-lg px-2.5 py-1.5 text-center min-w-[40px]">
              <div className="font-bold text-lg leading-none">{watchCount}</div>
              <div className="text-xs opacity-80 mt-0.5">Watch</div>
            </div>
          )}
          <div className="bg-emerald-500/80 rounded-lg px-2.5 py-1.5 text-center min-w-[40px]">
            <div className="font-bold text-lg leading-none">{normalCount}</div>
            <div className="text-xs opacity-80 mt-0.5">Normal</div>
          </div>
        </div>
      </div>

      {/* Summary text */}
      <div className="flex items-start gap-2 mb-5">
        <IconInfo className="w-4 h-4 mt-0.5 flex-shrink-0 text-clarity-300" />
        <p className="text-clarity-50 leading-relaxed text-sm">{data.summary}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSpeak}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
        >
          {speaking ? <IconVolumeOff className="w-4 h-4" /> : <IconVolume className="w-4 h-4" />}
          {speaking ? 'Stop' : 'Read aloud'}
        </button>
        <button
          onClick={onDownloadPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
        >
          <IconDownload className="w-4 h-4" />
          Download PDF
        </button>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors no-print"
        >
          <IconPrinter className="w-4 h-4" />
          Print
        </button>
      </div>
    </div>
  )
}
