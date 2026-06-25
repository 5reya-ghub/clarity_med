import React, { useRef, useState, useCallback } from 'react'
import { IconUpload, IconFile, IconX, IconAlertTriangle } from './Icons.jsx'

export default function UploadZone({ onFileSelect, processing }) {
  const inputRef = useRef(null)
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')

  const validateFile = (file) => {
    if (!file) return 'No file selected.'
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      return 'Please upload a PDF file.'
    }
    if (file.size > 20 * 1024 * 1024) {
      return 'File is too large. Please upload a PDF under 20 MB.'
    }
    return null
  }

  const handleFile = useCallback((file) => {
    const err = validateFile(file)
    if (err) { setFileError(err); return }
    setFileError('')
    setSelectedFile(file)
  }, [])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }, [handleFile])

  const onDragOver = (e) => { e.preventDefault(); setDragOver(true) }
  const onDragLeave = () => setDragOver(false)

  const handleSubmit = () => {
    if (selectedFile) onFileSelect(selectedFile)
  }

  const clearFile = () => {
    setSelectedFile(null)
    setFileError('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="max-w-xl mx-auto px-4">
      {/* Hero text */}
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mb-3">
          Understand your<br />
          <span className="text-clarity-600">medical report</span> — in plain words
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-base">
          Upload your lab report PDF. ClarityMed will explain every result in language anyone can understand.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={`
          relative rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 cursor-pointer
          ${dragOver
            ? 'border-clarity-500 bg-clarity-50 dark:bg-clarity-950/30'
            : selectedFile
            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 cursor-default'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-clarity-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center">
              <IconFile className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{selectedFile.name}</p>
              <p className="text-sm text-slate-400 mt-0.5">{(selectedFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); clearFile() }}
              className="text-slate-400 hover:text-rose-500 transition-colors p-1 rounded-full"
              title="Remove file"
            >
              <IconX className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${dragOver ? 'bg-clarity-100 dark:bg-clarity-900/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
              <IconUpload className={`w-7 h-7 transition-colors ${dragOver ? 'text-clarity-600' : 'text-slate-400'}`} />
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-200">
                {dragOver ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
              </p>
              <p className="text-sm text-slate-400 mt-0.5">or click to browse — max 20 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* File error */}
      {fileError && (
        <div className="mt-3 flex items-center gap-2 text-rose-600 dark:text-rose-400 text-sm bg-rose-50 dark:bg-rose-950/30 rounded-xl px-4 py-3">
          <IconAlertTriangle className="w-4 h-4 flex-shrink-0" />
          {fileError}
        </div>
      )}

      {/* Submit */}
      {selectedFile && (
        <button
          onClick={handleSubmit}
          disabled={processing}
          className="btn-primary w-full justify-center mt-4 py-3 text-base"
        >
          {processing ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Analysing your report…
            </>
          ) : (
            <>Simplify My Report</>
          )}
        </button>
      )}

      {/* Feature pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {['Plain-language results', 'Severity badges', 'AI chatbot', 'Voice read-aloud', 'Download PDF'].map((f) => (
          <span key={f} className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {f}
          </span>
        ))}
      </div>
    </div>
  )
}
