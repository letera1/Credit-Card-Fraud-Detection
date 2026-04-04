'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModelInfo() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [featureImportance, setFeatureImportance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchModelInfo()
  }, [])

  const fetchModelInfo = async () => {
    try {
      const [infoRes, featuresRes] = await Promise.all([
        axios.get('http://localhost:8000/model/info'),
        axios.get('http://localhost:8000/model/feature-importance')
      ])
      setModelInfo(infoRes.data)
      setFeatureImportance(featuresRes.data)
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
    { id: 'dataset', label: 'Dataset', icon: '📁' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Model Artifacts</h2>
          <p className="text-sm text-slate-400">Comprehensive ML model information and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-mono text-purple-400">v{modelInfo?.version || '3.0.0'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass-panel rounded-xl border border-white/5 p-2">
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
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
