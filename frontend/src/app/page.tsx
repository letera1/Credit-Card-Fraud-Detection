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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Credit Card Fraud Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Real-time fraud detection powered by advanced machine learning algorithms.
            Analyze transactions instantly with high accuracy.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            title="Accuracy"
            value="97.5%"
            description="Model ROC-AUC Score"
            trend="up"
          />
          <StatsCard
            title="Recall"
            value="92.3%"
            description="Fraud Detection Rate"
            trend="up"
          />
          <StatsCard
            title="Response Time"
            value="<50ms"
            description="Average Prediction Time"
            trend="stable"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Prediction Form */}
          <div>
            <PredictionForm
              onResult={setResult}
              loading={loading}
              setLoading={setLoading}
            />
          </div>

          {/* Result Display */}
          <div>
            {result ? (
              <ResultCard result={result} />
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-8 h-full flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <svg
                    className="mx-auto h-24 w-24 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">No prediction yet</p>
                  <p className="text-sm mt-2">
                    Enter transaction details to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-primary-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Real-time Detection</h3>
            <p className="text-gray-600">
              Instant fraud analysis with sub-50ms response time for immediate decision making.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-primary-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">High Accuracy</h3>
            <p className="text-gray-600">
              Advanced ML models with 97%+ ROC-AUC score for reliable fraud detection.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-primary-600 mb-4">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Business Insights</h3>
            <p className="text-gray-600">
              Cost-benefit analysis and threshold optimization for maximum ROI.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-gray-600 text-sm">
            © 2024 Credit Card Fraud Detection System. Built with Next.js and Machine Learning.
          </p>
        </div>
      </footer>
    </div>
  )
}
