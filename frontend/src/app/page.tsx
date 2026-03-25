'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import StatsCard from '@/components/StatsCard'
import { PredictionResult } from '@/types'

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <Header />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium backdrop-blur-sm">
              🛡️ AI-Powered Security
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4">
            Credit Card Fraud Detection
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Real-time fraud detection powered by advanced machine learning algorithms.
            Analyze transactions instantly with 97%+ accuracy.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Model Accuracy"
            value="97.5%"
            description="ROC-AUC Score"
            trend="up"
            icon="chart"
          />
          <StatsCard
            title="Detection Rate"
            value="92.3%"
            description="Fraud Recall"
            trend="up"
            icon="shield"
          />
          <StatsCard
            title="Response Time"
            value="<50ms"
            description="Average Latency"
            trend="stable"
            icon="zap"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            <PredictionForm
              onResult={setResult}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

          {/* Result Display */}
          <div className="transform transition-all duration-300 hover:scale-[1.01]">
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8 h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-20"></div>
                    <svg
                      className="mx-auto h-32 w-32 text-purple-400 relative"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-white mb-2">No prediction yet</p>
                  <p className="text-gray-400">
                    Enter transaction details to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Real-time Detection</h3>
            <p className="text-gray-400 leading-relaxed">
              Instant fraud analysis with sub-50ms response time for immediate decision making and risk assessment.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">High Accuracy</h3>
            <p className="text-gray-400 leading-relaxed">
              Advanced ML models with 97%+ ROC-AUC score ensuring reliable fraud detection and minimal false positives.
            </p>
          </div>

          <div className="group bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20">
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 w-16 h-16 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Business Insights</h3>
            <p className="text-gray-400 leading-relaxed">
              Cost-benefit analysis and threshold optimization for maximum ROI and financial protection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Credit Card Fraud Detection System. Powered by AI & Machine Learning.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <span className="text-sm">Privacy</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <span className="text-sm">Terms</span>
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <span className="text-sm">Documentation</span>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
