import React, { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import UploadZone from './components/UploadZone.jsx'
import SkeletonLoader from './components/SkeletonLoader.jsx'
import ReportView from './components/ReportView.jsx'
import { extractTextFromPDF } from './utils/pdfExtract.js'
import { api } from './utils/api.js'

export default function App() {
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [stage, setStage] = useState('upload') // upload | processing | report
  const [reportData, setReportData] = useState(null)
  const [originalText, setOriginalText] = useState('')
  const [error, setError] = useState('')
  const [processingStep, setProcessingStep] = useState('')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const handleFileSelect = async (file) => {
    setError('')
    setStage('processing')
    setProcessingStep('Extracting text from PDF…')

    try {
      const text = await extractTextFromPDF(file)
      setOriginalText(text)
      setProcessingStep('AI is analysing your report…')
      const data = await api.simplifyReport(text)
      setReportData(data)
      setStage('report')
    } catch (err) {
      console.error(err)
      setError(err.message || 'Something went wrong. Please try again.')
      setStage('upload')
    }
  }

  const handleReset = () => {
    setStage('upload')
    setReportData(null)
    setOriginalText('')
    setError('')
    setProcessingStep('')
  }

  return (
    <div className="min-h-screen">
      <Header
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
        hasReport={stage === 'report'}
        onReset={handleReset}
      />

      <main className="py-8">
        {stage === 'upload' && (
          <div className="max-w-6xl mx-auto">
            <UploadZone onFileSelect={handleFileSelect} processing={false} />
            {error && (
              <div className="max-w-xl mx-auto mt-4 px-4">
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl px-4 py-3 text-sm text-rose-600 dark:text-rose-400">
                  ⚠ {error}
                </div>
              </div>
            )}
          </div>
        )}

        {stage === 'processing' && (
          <div className="max-w-2xl mx-auto px-4">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 text-clarity-600 dark:text-clarity-400 font-medium">
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {processingStep}
              </div>
              <p className="text-sm text-slate-400 mt-1">This usually takes 10–20 seconds</p>
            </div>
            <SkeletonLoader />
          </div>
        )}

        {stage === 'report' && reportData && (
          <ReportView
            reportData={reportData}
            originalText={originalText}
          />
        )}
      </main>

      <footer className="border-t border-slate-100 dark:border-slate-800 mt-12 py-6 no-print">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} ClarityMed — AI-powered medical report simplifier</span>
          <span>Powered by Groq · Llama 3.3 70B · Whisper Large V3</span>
        </div>
      </footer>
    </div>
  )
}
