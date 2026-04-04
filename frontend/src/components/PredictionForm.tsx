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

  // Test data templates - calibrated for correct model predictions
  const testDataTemplates = {
    legitimate: {
      Time: 45000, V1: 0.05, V2: -0.12, V3: 0.08, V4: 0.03,
      V5: -0.04, V6: 0.09, V7: -0.06, V8: 0.02, V9: -0.05,
      V10: 0.07, V11: -0.03, V12: 0.04, V13: -0.08, V14: 0.02,
      V15: -0.05, V16: 0.06, V17: -0.04, V18: 0.03, V19: -0.07,
      V20: 0.04, V21: -0.03, V22: 0.05, V23: -0.04, V24: 0.02,
      V25: -0.05, V26: 0.06, V27: -0.03, V28: 0.04, Scaled_Amount: 0.25
    },
    moderate: {
      Time: 82000, V1: -0.85, V2: 1.12, V3: -0.67, V4: 0.95,
      V5: -0.78, V6: 0.62, V7: -0.89, V8: 0.45, V9: -0.56,
      V10: 0.73, V11: -0.48, V12: 0.82, V13: -0.71, V14: 0.58,
      V15: -0.64, V16: 0.77, V17: -0.51, V18: 0.43, V19: -0.69,
      V20: 0.54, V21: -0.47, V22: 0.61, V23: -0.55, V24: 0.49,
      V25: -0.68, V26: 0.59, V27: -0.46, V28: 0.38, Scaled_Amount: 1.45
    },
    fraud: {
      Time: 150000, V1: -2.85, V2: -3.12, V3: 1.67, V4: 2.45,
      V5: 1.89, V6: -1.56, V7: 0.98, V8: -0.45, V9: -0.78,
      V10: -1.23, V11: -0.89, V12: -1.12, V13: 1.34, V14: -2.67,
      V15: 2.45, V16: -0.98, V17: 1.56, V18: 1.89, V19: 2.34,
      V20: -0.67, V21: 1.23, V22: 0.98, V23: 1.78, V24: -0.56,
      V25: 0.89, V26: -0.45, V27: -0.78, V28: 0.34, Scaled_Amount: 3.25
    },
    critical: {
      Time: 165432, V1: -5.23, V2: -5.67, V3: 3.45, V4: 4.12,
      V5: 3.78, V6: -3.23, V7: 2.45, V8: -1.89, V9: -2.56,
      V10: -3.45, V11: -2.89, V12: -3.12, V13: 2.67, V14: -4.89,
      V15: 4.23, V16: -2.45, V17: 3.12, V18: 3.67, V19: 4.45,
      V20: -1.89, V21: 2.78, V22: 2.45, V23: 3.56, V24: -2.12,
      V25: 2.34, V26: -1.89, V27: -2.45, V28: 1.67, Scaled_Amount: 6.75
    }
  }

  const loadTestData = (type: 'legitimate' | 'moderate' | 'fraud' | 'critical') => {
    const data = testDataTemplates[type]
    setRawInput(JSON.stringify(data, null, 2))
    setUseRawInput(true)
    setError(null)
  }

  const handleGenerateData = () => {
    loadTestData('fraud')
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
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">
              JSON Payload Window
            </label>
            
            {/* Quick Load Test Data Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button 
                type="button" 
                onClick={() => loadTestData('legitimate')}
                className="px-3 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/50 rounded-lg text-xs font-mono text-green-400 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Legitimate</span>
              </button>
              
              <button 
                type="button" 
                onClick={() => loadTestData('moderate')}
                className="px-3 py-2 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 hover:border-yellow-500/50 rounded-lg text-xs font-mono text-yellow-400 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Moderate Risk</span>
              </button>
              
              <button 
                type="button" 
                onClick={() => loadTestData('fraud')}
                className="px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 hover:border-orange-500/50 rounded-lg text-xs font-mono text-orange-400 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>Fraud</span>
              </button>
              
              <button 
                type="button" 
                onClick={() => loadTestData('critical')}
                className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg text-xs font-mono text-red-400 transition-all flex items-center justify-center space-x-2"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <span>Critical Fraud</span>
              </button>
            </div>

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
