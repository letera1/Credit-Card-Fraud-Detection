'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import AnalyticsDashboard from '@/components/AnalyticsDashboard'
import TransactionHistory from '@/components/TransactionHistory'
import { PredictionResult } from '@/types'

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze')

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-primary">Enterprise Security Platform</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            AI-Powered Fraud Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Real-time fraud detection with advanced ML, anomaly detection, risk scoring, and behavioral analytics
          </p>
        </div>

        {/* Analytics Dashboard */}
        <AnalyticsDashboard />

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'analyze'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔍 Analyze Transaction
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-all ${
              activeTab === 'history'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📊 Transaction History
          </button>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'analyze' ? (
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
                    Ready to Analyze
                  </p>
                  <p className="text-muted-foreground">
                    Enter transaction details or generate random data
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TransactionHistory />
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Real-time Detection</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Instant fraud analysis with sub-50ms response time and immediate risk assessment
            </p>
          </div>

          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Risk Scoring</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced 0-100 risk scoring with LOW, MEDIUM, HIGH, and CRITICAL levels
            </p>
          </div>

          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Alert Management</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Automated alerts for suspicious activities with severity classification
            </p>
          </div>

          <div className="group p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all">
            <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Anomaly Detection</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Identifies unusual patterns and behaviors that deviate from normal transactions
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 Fraud Detection AI - Enterprise Edition v2.0
            </p>
            <div className="flex items-center space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                API Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
