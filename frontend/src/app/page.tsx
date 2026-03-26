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
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-primary">AI-Powered Security</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Credit Card Fraud Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time fraud detection powered by advanced machine learning algorithms.
            Analyze transactions instantly with enterprise-grade accuracy.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatsCard
            icon="🎯"
            title="Model Accuracy"
            value="99.8%"
            description="ROC-AUC Score"
            trend="up"
          />
          <StatsCard
            icon="⚡"
            title="Response Time"
            value="<50ms"
            description="Average Latency"
            trend="stable"
          />
          <StatsCard
            icon="🔒"
            title="Detection Rate"
            value="92.3%"
            description="Fraud Recall"
            trend="up"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <PredictionForm
            onResult={setResult}
            loading={loading}
            setLoading={setLoading}
          />
          {result ? (
            <ResultCard result={result} />
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-sm p-12 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-primary"
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
                </div>
                <p className="text-xl font-semibold text-foreground mb-2">
                  No prediction yet
                </p>
                <p className="text-muted-foreground">
                  Enter transaction details to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Real-time Detection</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Instant fraud analysis with sub-50ms response time for immediate decision making and risk assessment.
            </p>
          </div>

          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">High Accuracy</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced ML models with 99%+ ROC-AUC score ensuring reliable fraud detection and minimal false positives.
            </p>
          </div>

          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Business Insights</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cost-benefit analysis and threshold optimization for maximum ROI and financial protection.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Fraud Detection AI. Powered by Machine Learning.
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Documentation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
