'use client'

import { useEffect, useState } from 'react'
import { getModelInfo, getFeatureImportance, getDataDrift } from '@/lib/api'

export default function ModelInfo() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [featureImportance, setFeatureImportance] = useState<any>(null)
  const [driftData, setDriftData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchModelInfo()
    const interval = setInterval(fetchModelInfo, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchModelInfo = async () => {
    try {
      const [infoData, featuresData, driftRes] = await Promise.all([
        getModelInfo(),
        getFeatureImportance(),
        getDataDrift().catch(() => null)
      ])
      setModelInfo(infoData)
      setFeatureImportance(featuresData)
      if (driftRes) setDriftData(driftRes)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch model info:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'models', label: 'Models', icon: '🤖' },
    { id: 'features', label: 'Features', icon: '🔬' },
    { id: 'dataset', label: 'Dataset', icon: '📁' },
    { id: 'drift', label: 'Data Drift', icon: '🌊' }
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight flex items-center space-x-3">
            <svg className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            <span>Model Artifacts</span>
          </h2>
          <p className="text-sm text-slate-400 font-mono">Comprehensive ML model information and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3 relative z-10">
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center space-x-3 backdrop-blur-md">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"></div>
            <span className="text-sm font-mono font-bold text-purple-300 tracking-widest">v{modelInfo?.version || '3.0.0'}</span>
          </div>
        </div>
      </div>

      {/* Segmented Control Tabs */}
      <div className="glass-panel rounded-2xl border border-white/10 p-1.5 relative overflow-x-auto hide-scrollbar">
        <div className="flex min-w-max space-x-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 px-6 py-3 rounded-xl text-sm font-bold font-mono tracking-wider transition-all duration-300 flex items-center justify-center space-x-2 z-10 overflow-hidden ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/80 to-cyan-600/80 shadow-[0_0_20px_rgba(168,85,247,0.4)] -z-10 rounded-xl"></div>
                )}
                <span className={`text-lg ${isActive ? 'drop-shadow-[0_0_8px_currentColor]' : 'opacity-70'}`}>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl border border-purple-500/20 p-6 relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Model Version</p>
                    <p className="text-2xl font-bold text-white">{modelInfo?.version || 'v3.0.0'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-blue-500/20 p-6 relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Total Features</p>
                    <p className="text-2xl font-bold text-white">{featureImportance?.total_features || 45}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-green-500/20 p-6 relative overflow-hidden group hover:border-green-500/40 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">ROC-AUC Score</p>
                    <p className="text-2xl font-bold text-white">
                      {modelInfo?.models?.ensemble?.roc_auc 
                        ? (modelInfo.models.ensemble.roc_auc * 100).toFixed(2) + '%'
                        : '99.8%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Architecture */}
          <div className="glass-panel rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span>🏗️</span>
              <span>Model Architecture</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-purple-400">XGBoost</span>
                  <span className="px-2 py-1 rounded bg-purple-500/20 text-xs font-mono text-purple-400">Primary</span>
                </div>
                <p className="text-xs text-slate-400">Gradient boosting framework with high performance</p>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-blue-400">LightGBM</span>
                  <span className="px-2 py-1 rounded bg-blue-500/20 text-xs font-mono text-blue-400">Ensemble</span>
                </div>
                <p className="text-xs text-slate-400">Fast gradient boosting with leaf-wise growth</p>
              </div>
              <div className="p-5 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 hover:scale-105 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-green-400">Random Forest</span>
                  <span className="px-2 py-1 rounded bg-green-500/20 text-xs font-mono text-green-400">Ensemble</span>
                </div>
                <p className="text-xs text-slate-400">Ensemble of decision trees for robustness</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'models' && modelInfo?.models && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span>📈</span>
              <span>Model Performance Comparison</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(modelInfo.models).map(([name, metrics]: [string, any], idx) => {
                const colors = ['purple', 'blue', 'green', 'orange']
                const color = colors[idx % colors.length]
                return (
                  <div key={name} className={`p-5 rounded-xl bg-${color}-500/10 border border-${color}-500/30 hover:scale-105 transition-all`}>
                    <p className={`text-sm font-bold text-${color}-400 mb-4 uppercase tracking-wider`}>{name}</p>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">ROC-AUC</span>
                          <span className={`font-bold text-${color}-400`}>{(metrics.roc_auc * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-${color}-500`} style={{ width: `${metrics.roc_auc * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Precision</span>
                          <span className={`font-bold text-${color}-400`}>{(metrics.precision * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-${color}-500`} style={{ width: `${metrics.precision * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">Recall</span>
                          <span className={`font-bold text-${color}-400`}>{(metrics.recall * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-${color}-500`} style={{ width: `${metrics.recall * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-400">F1-Score</span>
                          <span className={`font-bold text-${color}-400`}>{(metrics.f1 * 100).toFixed(2)}%</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full bg-${color}-500`} style={{ width: `${metrics.f1 * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'features' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Feature Engineering */}
          {modelInfo?.feature_engineering && (
            <div className="glass-panel rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <span>🔧</span>
                <span>Feature Engineering Pipeline</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(modelInfo.feature_engineering).map(([category, features]: [string, any]) => (
                  <div key={category} className="p-5 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all">
                    <p className="text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                      {category.replace(/_/g, ' ')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(features) && features.map((feature: string, idx: number) => (
                        <span key={idx} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono hover:scale-105 transition-all">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Feature Importance */}
          {featureImportance?.feature_importance && (
            <div className="glass-panel rounded-2xl border border-white/5 p-6">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
                <span>⭐</span>
                <span>Top 10 Most Important Features</span>
              </h3>
              <div className="space-y-3">
                {Object.entries(featureImportance.feature_importance)
                  .slice(0, 10)
                  .map(([feature, importance]: [string, any], idx: number) => {
                    const colors = ['purple', 'blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'pink', 'indigo', 'teal']
                    const color = colors[idx]
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className={`w-8 h-8 rounded-lg bg-${color}-500/10 border border-${color}-500/30 flex items-center justify-center text-xs font-bold text-${color}-400`}>
                              #{idx + 1}
                            </span>
                            <span className="text-sm font-mono text-white">{feature}</span>
                          </div>
                          <span className={`text-lg font-bold text-${color}-400`}>
                            {(importance * 100).toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-400 shadow-[0_0_10px_currentColor] transition-all duration-1000 group-hover:shadow-[0_0_20px_currentColor]`}
                            style={{ width: `${importance * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'dataset' && modelInfo?.dataset && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel rounded-2xl border border-white/5 p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center space-x-2">
              <span>📊</span>
              <span>Training Dataset Statistics</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="p-5 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:scale-105 transition-all">
                <p className="text-xs font-mono text-purple-400 uppercase tracking-widest mb-2">Total Samples</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {modelInfo.dataset.total_samples?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">Training records</p>
              </div>
              <div className="p-5 rounded-xl bg-red-500/10 border border-red-500/30 hover:scale-105 transition-all">
                <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">Fraud Rate</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {(modelInfo.dataset.fraud_rate * 100).toFixed(2)}%
                </p>
                <p className="text-xs text-slate-400">Class imbalance</p>
              </div>
              <div className="p-5 rounded-xl bg-blue-500/10 border border-blue-500/30 hover:scale-105 transition-all">
                <p className="text-xs font-mono text-blue-400 uppercase tracking-widest mb-2">Train Split</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {modelInfo.dataset.train_samples?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">80% of dataset</p>
              </div>
              <div className="p-5 rounded-xl bg-green-500/10 border border-green-500/30 hover:scale-105 transition-all">
                <p className="text-xs font-mono text-green-400 uppercase tracking-widest mb-2">Test Split</p>
                <p className="text-3xl font-bold text-white mb-1">
                  {modelInfo.dataset.test_samples?.toLocaleString()}
                </p>
                <p className="text-xs text-slate-400">20% of dataset</p>
              </div>
            </div>
          </div>

          {/* Data Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Class Distribution</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Legitimate Transactions</span>
                    <span className="text-sm font-bold text-green-400">
                      {((1 - modelInfo.dataset.fraud_rate) * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-3">
                    <div className="h-3 rounded-full bg-green-500" style={{ width: `${(1 - modelInfo.dataset.fraud_rate) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Fraudulent Transactions</span>
                    <span className="text-sm font-bold text-red-400">
                      {(modelInfo.dataset.fraud_rate * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-black/40 rounded-full h-3">
                    <div className="h-3 rounded-full bg-red-500" style={{ width: `${modelInfo.dataset.fraud_rate * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-white/5 p-6">
              <h3 className="text-sm font-bold text-white mb-4">Data Quality</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="text-sm text-slate-300">Missing Values</span>
                  <span className="text-sm font-bold text-green-400">0%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="text-sm text-slate-300">Duplicates</span>
                  <span className="text-sm font-bold text-green-400">0%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="text-sm text-slate-300">Data Quality Score</span>
                  <span className="text-sm font-bold text-green-400">100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
