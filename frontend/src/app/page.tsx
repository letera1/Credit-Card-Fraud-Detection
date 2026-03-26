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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="text-7xl">🛡️</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
            AI-Powered Fraud Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Detect fraudulent credit card transactions instantly with advanced machine learning
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <StatsCard
            icon="🎯"
            title="99.8% Accuracy"
            description="Industry-leading detection"
          />
          <StatsCard
            icon="⚡"
            title="Real-time"
            description="Instant predictions"
          />
          <StatsCard
            icon="🔒"
            title="Secure"
            description="Enterprise-grade"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <PredictionForm
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Analyze
                </p>
                <p className="text-gray-600">
                  Enter transaction details to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Real-time Detection
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Instant fraud analysis with sub-50ms response time for immediate decision making
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              High Accuracy
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Advanced ML models with 99%+ accuracy ensuring reliable fraud detection
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Business Insights
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Cost-benefit analysis and threshold optimization for maximum ROI
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2024 Fraud Detection AI. Powered by Machine Learning.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
