'use client'

import { useState } from 'react'
import axios from 'axios'
import { PredictionResult } from '@/types'

interface PredictionFormProps {
  onResult: (result: PredictionResult) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function PredictionForm({ onResult, loading, setLoading }: PredictionFormProps) {
  const [useRawInput, setUseRawInput] = useState(false)
  const [rawInput, setRawInput] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleGenerateData = () => {
    // Generate malicious-looking data to force a fraud detection for demo purposes
    const mockData = {
      Time: Math.floor(Math.random() * 100000),
      V1: -3.043541, V2: -3.157307, V3: 1.088463, V4: 2.288644,
      V5: 1.359805, V6: -1.064823, V7: 0.325574, V8: -0.067794,
      V9: -0.270953, V10: -0.838587, V11: -0.414575, V12: -0.503141,
      V13: 0.676502, V14: -1.692029, V15: 2.000635, V16: -0.366753,
      V17: 0.613322, V18: 1.259972, V19: 2.083313, V20: -0.252773,
      V21: 0.661696, V22: 0.435477, V23: 1.375966, V24: -0.293803,
      V25: 0.279798, V26: -0.145362, V27: -0.252773, V28: 0.035764,
      Scaled_Amount: 529.00
    }
    setRawInput(JSON.stringify(mockData, null, 2))
    setUseRawInput(true)
    setError(null)
  }

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let data
      if (useRawInput) {
        data = JSON.parse(rawInput)
      } else {
        // Empty form submit generates realistic benign data if not filled
        data = {
          Time: Math.floor(Math.random() * 86400),
          V1: Math.random() * 2 - 1, V2: Math.random() * 2 - 1, V3: Math.random() * 2 - 1,
          V4: Math.random() * 2 - 1, V5: Math.random() * 2 - 1, V6: Math.random() * 2 - 1,
          V7: Math.random() * 2 - 1, V8: Math.random() * 2 - 1, V9: Math.random() * 2 - 1,
          V10: Math.random() * 2 - 1, V11: Math.random() * 2 - 1, V12: Math.random() * 2 - 1,
          V13: Math.random() * 2 - 1, V14: Math.random() * 2 - 1, V15: Math.random() * 2 - 1,
          V16: Math.random() * 2 - 1, V17: Math.random() * 2 - 1, V18: Math.random() * 2 - 1,
          V19: Math.random() * 2 - 1, V20: Math.random() * 2 - 1, V21: Math.random() * 2 - 1,
          V22: Math.random() * 2 - 1, V23: Math.random() * 2 - 1, V24: Math.random() * 2 - 1,
          V25: Math.random() * 2 - 1, V26: Math.random() * 2 - 1, V27: Math.random() * 2 - 1,
          V28: Math.random() * 2 - 1, Scaled_Amount: Math.random() * 100
        }
      }

      const response = await axios.post('http://localhost:8000/predict', data)
      onResult(response.data)
      // Play a little UI trick by keeping loading state up slightly longer for cool aesthetic effect
      setTimeout(() => setLoading(false), 800)
    } catch (err: any) {
      setError(err.message || 'Failed to connect to ML API')
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel rounded-2xl p-8 border border-white/10 relative overflow-hidden h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight">Data Ingestion</h2>
          <p className="text-xs font-mono text-slate-400 mt-1">Send payload to Inference Engine</p>
        </div>
        
        {/* Toggle Mode */}
        <div className="flex bg-black/40 rounded-lg p-1 border border-white/5">
          <button
            type="button"
            onClick={() => setUseRawInput(false)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${!useRawInput ? 'bg-white/10 text-white shadow' : 'text-slate-500 hover:text-white'}`}
          >
            Auto/Benign
          </button>
          <button
            type="button"
            onClick={() => setUseRawInput(true)}
            className={`px-3 py-1.5 text-xs font-mono rounded-md transition-all ${useRawInput ? 'bg-white/10 text-white shadow' : 'text-slate-500 hover:text-white'}`}
          >
            JSON/Raw
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-6 flex items-start space-x-3">
          <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <p className="text-sm font-mono text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handlePredict} className="flex-1 flex flex-col">
        {useRawInput ? (
          <div className="flex-1 flex flex-col min-h-[300px]">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex justify-between">
              JSON Payload Window
              <button type="button" onClick={handleGenerateData} className="text-purple-400 hover:text-purple-300 transition-colors flex items-center">
                 <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                 Inject Fraud Signature
              </button>
            </label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-green-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all resize-none scrollbar-hide shadow-inner"
              placeholder={'{\n  "V1": 0.123,\n  "V2": -1.456\n  ...\n}'}
              spellCheck="false"
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-black/20 p-8 text-center group transition-colors hover:border-white/20 hover:bg-black/30">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
               <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            </div>
            <h3 className="text-white font-semibold mb-2 tracking-wide">Auto-generate Batch Data</h3>
            <p className="text-sm text-slate-400 font-mono mb-6 max-w-sm">Will generate randomized standard deviation vectors spanning all 28 PCA dimensions to simulate a benign credit transaction.</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-mono font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-[0.98] flex justify-center items-center relative overflow-hidden"
        >
          {loading ? (
            <>
              {/* Processing scan line animation */}
              <div className="absolute top-0 bottom-0 left-[-20%] w-1/5 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_1.5s_infinite]"></div>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              EXECUTING INFERENCE...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              RUN PREDICTION MODEL
            </>
          )}
        </button>
      </form>
    </div>
  )
}
