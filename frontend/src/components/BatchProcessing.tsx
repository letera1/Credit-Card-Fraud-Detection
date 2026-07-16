'use client'

import { useState, useRef } from 'react'
import axios from 'axios'

interface BatchResult {
  total: number
  processed: number
  fraud_detected: number
  processing_time: number
  results: any[]
}

export default function BatchProcessing() {
  const [file, setFile] = useState<File | null>(null)
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<BatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith('.json')) {
        setFile(droppedFile)
        setError(null)
      } else {
        setError('Please upload a JSON file')
      }
    }
  }

  const processBatch = async () => {
    if (!file) return
    setProcessing(true)
    setError(null)
    setUploadProgress(0)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string
          const transactions = JSON.parse(text)
          if (!Array.isArray(transactions)) throw new Error('File must contain an array of transactions')

          const startTime = Date.now()
          const batchResults = []
          let fraudCount = 0
          const totalBatches = Math.ceil(transactions.length / 10)

          for (let i = 0; i < transactions.length; i += 10) {
            const batch = transactions.slice(i, i + 10)
            const currentBatch = Math.floor(i / 10) + 1
            setUploadProgress((currentBatch / totalBatches) * 100)

            const promises = batch.map(tx =>
              axios.post('http://localhost:8000/predict', tx)
                .then(res => res.data)
                .catch(err => ({ error: err.message }))
            )
            const batchRes = await Promise.all(promises)
            batchResults.push(...batchRes)
            fraudCount += batchRes.filter((r: any) => r.is_fraud).length
          }

          setResults({
            total: transactions.length,
            processed: batchResults.length,
            fraud_detected: fraudCount,
            processing_time: (Date.now() - startTime) / 1000,
            results: batchResults
          })
        } catch (err: any) {
          setError(err.message || 'Failed to process batch')
        } finally {
          setProcessing(false)
          setUploadProgress(100)
        }
      }
      reader.readAsText(file)
    } catch (err: any) {
      setError(err.message || 'Failed to read file')
      setProcessing(false)
    }
  }

  const downloadJSON = () => {
    if (!results) return
    const dataStr = JSON.stringify(results.results, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `batch_results_${Date.now()}.json`
    link.click()
  }

  const downloadCSV = () => {
    if (!results) return
    const headers = ['transaction_id', 'fraud_probability', 'is_fraud', 'risk_score', 'risk_level']
    const rows = results.results.map(r => [
      r.transaction_id || 'N/A',
      (r.fraud_probability || 0).toFixed(4),
      r.is_fraud ? 'TRUE' : 'FALSE',
      r.risk_score || '0',
      r.risk_level || 'UNKNOWN'
    ])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `batch_results_${Date.now()}.csv`
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-transparent rounded-3xl blur-3xl" />
        <div className="relative">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-gradient-x">
            Batch Processing
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Process multiple transactions simultaneously for bulk fraud detection
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="glass-panel rounded-3xl border-border/50 p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5" />
        <div className="relative">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full max-w-xl">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  isDragging
                    ? 'border-purple-500 bg-purple-500/10 scale-[1.02]'
                    : 'border-border/60 hover:border-purple-500/50 bg-muted/10 hover:bg-muted/20'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex flex-col items-center justify-center pt-5 pb-6 relative z-10">
                  <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="mb-2 text-sm text-foreground font-medium">
                    {isDragging ? 'Drop your file here' : file ? file.name : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JSON file with array of transactions (MAX 1000)
                  </p>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
              />

              {/* File Preview Card */}
              {file && (
                <div className="mt-4 flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50 animate-fade-in-up">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-500 hover:text-red-400 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl animate-fade-in-up">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              {/* Processing Progress */}
              {processing && (
                <div className="mt-6 space-y-3 animate-fade-in-up">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing transactions...</span>
                    <span className="font-mono text-purple-400">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Batch {Math.ceil((uploadProgress / 100) * (file ? 10 : 1))} processing...
                  </p>
                </div>
              )}

              {/* Process Button */}
              <button
                onClick={processBatch}
                disabled={!file || processing}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Process Batch</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6 animate-fade-in-up">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Processed',
                value: results.processed,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                gradient: 'from-purple-500 to-blue-500',
                borderColor: 'border-purple-500/30'
              },
              {
                label: 'Fraud Detected',
                value: results.fraud_detected,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                ),
                gradient: 'from-red-500 to-orange-500',
                borderColor: 'border-red-500/30'
              },
              {
                label: 'Fraud Rate',
                value: `${((results.fraud_detected / results.processed) * 100).toFixed(1)}%`,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                gradient: 'from-yellow-500 to-orange-500',
                borderColor: 'border-yellow-500/30'
              },
              {
                label: 'Processing Time',
                value: `${results.processing_time.toFixed(2)}s`,
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                gradient: 'from-green-500 to-emerald-500',
                borderColor: 'border-green-500/30'
              },
            ].map((s, i) => (
              <div
                key={i}
                className={`glass-panel rounded-2xl border ${s.borderColor} p-5 hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-mono text-muted-foreground">{s.label}</p>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.gradient} flex items-center justify-center text-white`}>
                    {s.icon}
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Download Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadJSON}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download JSON</span>
            </button>
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-2xl font-medium transition-all duration-300 flex items-center space-x-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="glass-panel rounded-3xl border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50 bg-gradient-to-r from-purple-500/10 to-blue-500/10">
              <h3 className="text-lg font-bold text-foreground">Batch Results</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Showing {Math.min(results.results.length, 100)} of {results.results.length} results
              </p>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-muted/30 sticky top-0">
                  <tr>
                    {['#', 'Transaction ID', 'Status', 'Risk Score', 'Probability'].map(h => (
                      <th key={h} className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {results.results.slice(0, 100).map((result, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-muted/20 transition-colors duration-200"
                    >
                      <td className="py-4 px-6 text-sm text-muted-foreground font-mono">{idx + 1}</td>
                      <td className="py-4 px-6 text-sm font-mono text-foreground">
                        {result.transaction_id?.slice(-12) || 'N/A'}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          result.is_fraud
                            ? 'bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 border border-red-500/30'
                            : 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {result.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm font-mono text-foreground">
                        {result.risk_score || 0}
                      </td>
                      <td className="py-4 px-6 text-sm font-mono text-muted-foreground">
                        {((result.fraud_probability || 0) * 100).toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
