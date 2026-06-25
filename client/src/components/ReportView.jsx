import React, { useState } from 'react'
import SummaryCard from './SummaryCard.jsx'
import FindingCard from './FindingCard.jsx'
import ChatPanel from './ChatPanel.jsx'
import DietPlanner from './DietPlanner.jsx'
import NextActions from './NextActions.jsx'
import DisclaimerBanner from './DisclaimerBanner.jsx'
import { IconEye } from './Icons.jsx'
import { generateReportPDF } from '../utils/pdfGenerate.js'
import { stopSpeaking } from '../utils/tts.js'

const TABS = [
  { id: 'results',  label: '🔬 Results' },
  { id: 'diet',     label: '🥗 Diet Plan' },
  { id: 'actions',  label: '📋 Next Steps' },
  { id: 'chat',     label: '💬 Ask AI' },
]

export default function ReportView({ reportData, originalText }) {
  const [activeTab, setActiveTab] = useState('results')
  const [showOriginal, setShowOriginal] = useState(false)
  const [summarySpeaking, setSummarySpeaking] = useState(false)
  const [globalSpeaking, setGlobalSpeaking] = useState(false)

  const handleDownloadPDF = () => generateReportPDF(reportData)

  const reportContext = `
Report Type: ${reportData.reportType || 'Medical Report'}
Patient: ${reportData.patientName || 'Unknown'}
Date: ${reportData.reportDate || 'Unknown'}
Summary: ${reportData.summary}

Findings:
${reportData.findings.map(f =>
  `- ${f.test}${f.abbreviation ? ` (${f.abbreviation})` : ''}: ${f.value} [Range: ${f.referenceRange}] — ${f.severity}
   ${f.plainExplanation}
   ${f.whatItMeans ? 'What it means: ' + f.whatItMeans : ''}`
).join('\n')}`.trim()

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      {/* Severity legend */}
      <div className="flex flex-wrap items-center gap-3 mb-4 no-print">
        <span className="text-xs text-slate-400 font-medium">Severity:</span>
        <span className="badge-normal">● Normal</span>
        <span className="badge-watch">▲ Watch</span>
        <span className="badge-urgent">! Urgent</span>
      </div>

      <DisclaimerBanner />

      {/* Summary card always on top */}
      <div className="mt-4 mb-5">
        <SummaryCard
          data={reportData}
          onDownloadPDF={handleDownloadPDF}
          speaking={summarySpeaking}
          setSpeaking={setSummarySpeaking}
        />
      </div>

      {/* Main tab navigation */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1.5 mb-5 no-print">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2.5 px-2 rounded-xl text-sm transition-all duration-200 ${
              activeTab === tab.id ? 'tab-active' : 'tab-inactive'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results tab */}
      {activeTab === 'results' && (
        <div className="fade-in">
          {/* View toggle */}
          <div className="flex items-center gap-2 mb-4 no-print">
            <button onClick={() => setShowOriginal(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!showOriginal ? 'bg-clarity-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              Simplified
            </button>
            <button onClick={() => setShowOriginal(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${showOriginal ? 'bg-clarity-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
              <IconEye className="w-4 h-4" /> Original
            </button>
            <span className="text-xs text-slate-400 ml-1">{reportData.findings.length} results</span>
          </div>

          {showOriginal ? (
            <div className="card p-5">
              <h3 className="font-semibold text-slate-700 dark:text-slate-200 mb-3 text-sm">Original Report Text</h3>
              <pre className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed max-h-[600px] overflow-y-auto font-mono">
                {originalText}
              </pre>
            </div>
          ) : (
            <div className="space-y-3">
              {[...reportData.findings]
                .sort((a, b) => ({ Urgent: 0, Watch: 1, Normal: 2 }[a.severity] ?? 2) - ({ Urgent: 0, Watch: 1, Normal: 2 }[b.severity] ?? 2))
                .map(finding => (
                  <FindingCard
                    key={finding.id}
                    finding={finding}
                    onAskChatbot={(q) => { setActiveTab('chat') }}
                    globalSpeaking={globalSpeaking}
                    setGlobalSpeaking={(v) => { setGlobalSpeaking(v); if (!v) stopSpeaking() }}
                  />
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* Diet tab */}
      {activeTab === 'diet' && (
        <div className="max-w-2xl mx-auto fade-in">
          <DietPlanner reportData={reportData} />
        </div>
      )}

      {/* Actions tab */}
      {activeTab === 'actions' && (
        <div className="max-w-2xl mx-auto fade-in">
          <NextActions reportData={reportData} />
        </div>
      )}

      {/* Chat tab */}
      {activeTab === 'chat' && (
        <div className="max-w-2xl mx-auto fade-in">
          <ChatPanel reportContext={reportContext} />
        </div>
      )}
    </div>
  )
}
