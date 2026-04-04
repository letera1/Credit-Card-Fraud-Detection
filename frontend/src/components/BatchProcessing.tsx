'use client'

import { useState } from 'react'
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const processBatch = async () => {
    if (!file) return

    setProcessing(true)
    setError(null)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const text = e.target?.result as string
          const transactions = JSON.parse(text)
          
          if (!Array.isArray(transactions)) {
            throw new Error('File must contain an array of transactions')
          }

          const startTime = Date.now()
          const batchResults = []
          let fraudCount = 0

          // Process in batches of 10
          for (let i = 0; i < transactions.length; i += 10) {
            const batch = transactions.slice(i, i + 10)
            const promises = batch.map(tx => 
              axios.post('http://localhost:8000/predict', tx)
                .then(res => res.data)
                .catch(err => ({ error: err.message }))
            )
            const batchRes = await Promise.all(promises)
            batchResults.push(...batchRes)
            fraudCount += batchRes.filter(r => r.is_fraud).length
          }

          const processingTime = (Date.now() - startTime) / 1000

          setResults({
            total: transactions.length,
            processed: batchResults.length,
            fraud_detected: fraudCount,
            processing_time: processingTime,
            results: batchResults
          })
        } catch (err: any) {
          setError(err.message || 'Failed to process batch')
        } finally {
          setProcessing(false)
        }
      }
      reader.readAsText(file)
    } catch (err: any) {
      setError(err.message || 'Failed to read file')
      setProcessing(false)
    }
  }

  const downloadResults = () => {
    if (!results) return
    
    const dataStr = JSON.stringify(results.results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
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
      r.fraud_probability?.toFixed(4) || '0',
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Batch Processing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Process multiple transactions simultaneously for bulk fraud detection
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-card rounded-xl border border-border p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-xl">
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 transition-colors bg-secondary/20">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-16 h-16 mb-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-foreground font-medium">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">
                  JSON file with array of transactions (MAX 1000)
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".json"
                onChange={handleFileUpload}
              />
            </label>

            {file && (
              <div className="mt-4 flex items-center justify-between p-4 bg-secondary rounded-lg">
                <div className="flex items-center space-x-3">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-500 hover:text-red-400"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            <button
              onClick={processBatch}
              disabled={!file || processing}
              className="w-full mt-6 bg-primary hover:bg-primary/90 disabled:bg-secondary disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              {processing ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Processed</p>
              <p className="text-3xl font-bold text-foreground">{results.processed}</p>
            </div>
            <div className="bg-card rounded-xl border border-red-500/20 p-6">
              <p className="text-sm text-red-500 mb-2">Fraud Detected</p>
              <p className="text-3xl font-bold text-red-500">{results.fraud_detected}</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Fraud Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {((results.fraud_detected / results.processed) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <p className="text-sm text-muted-foreground mb-2">Processing Time</p>
              <p className="text-3xl font-bold text-foreground">{results.processing_time.toFixed(2)}s</p>
            </div>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={downloadResults}
              className="px-6 py-3 bg-secondary hover:bg-accent text-foreground rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download JSON</span>
            </button>
            <button
              onClick={downloadCSV}
              className="px-6 py-3 bg-secondary hover:bg-accent text-foreground rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Download CSV</span>
            </button>
          </div>

          {/* Results Table */}
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold text-foreground">Batch Results</h3>
            </div>
            <div className="overflow-x-auto max-h-96">
              <table className="w-full">
                <thead className="bg-secondary sticky top-0">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">#</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Transaction ID</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Risk Score</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase">Probability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {results.results.slice(0, 100).map((result, idx) => (
                    <tr key={idx} className="hover:bg-secondary/50">
                      <td className="py-3 px-4 text-sm text-muted-foreground">{idx + 1}</td>
                      <td className="py-3 px-4 text-sm font-mono text-foreground">
                        {result.transaction_id?.slice(-12) || 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          result.is_fraud
                            ? 'bg-red-500/10 text-red-500'
                            : 'bg-green-500/10 text-green-500'
                        }`}>
                          {result.is_fraud ? 'FRAUD' : 'LEGITIMATE'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">{result.risk_score || 0}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
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
