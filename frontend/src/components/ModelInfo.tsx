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
            <div className="glass-panel rounded-2xl border border-purple-500/30 p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                    <svg className="w-6 h-6 text-purple-300 drop-shadow-[0_0_8px_currentColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-xs font-mono font-bold text-purple-300 border border-purple-500/30">ACTIVE</span>
                </div>
                <p className="text-xs font-mono text-purple-200/70 uppercase tracking-widest mb-1">Model Version</p>
                <p className="text-4xl font-black font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{modelInfo?.version || 'v3.0.0'}</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-blue-500/30 p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <svg className="w-6 h-6 text-blue-300 drop-shadow-[0_0_8px_currentColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-blue-500/20 text-xs font-mono font-bold text-blue-300 border border-blue-500/30">FEATURES</span>
                </div>
                <p className="text-xs font-mono text-blue-200/70 uppercase tracking-widest mb-1">Total Inputs</p>
                <p className="text-4xl font-black font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{featureImportance?.total_features || 45}</p>
              </div>
            </div>

            <div className="glass-panel rounded-2xl border border-green-500/30 p-6 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 hover:-translate-y-1">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/50 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.4)]">
                    <svg className="w-6 h-6 text-green-300 drop-shadow-[0_0_8px_currentColor]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-xs font-mono font-bold text-green-300 border border-green-500/30">PERFORMANCE</span>
                </div>
                <p className="text-xs font-mono text-green-200/70 uppercase tracking-widest mb-1">ROC-AUC Score</p>
                <p className="text-4xl font-black font-mono text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                  {modelInfo?.models?.ensemble?.roc_auc 
                    ? (modelInfo.models.ensemble.roc_auc * 100).toFixed(2) + '%'
                    : '99.8%'}
                </p>
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
          <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 opacity-50"></div>
            <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3">
              <span className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">📈</span>
              <span>Model Performance Comparison</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(modelInfo.models).map(([name, metrics]: [string, any], idx) => {
                const colors = ['purple', 'cyan', 'green', 'orange']
                const gradients = [
                  'from-purple-500 to-pink-500',
                  'from-cyan-500 to-blue-500',
                  'from-green-500 to-emerald-500',
                  'from-orange-500 to-yellow-500'
                ]
                const color = colors[idx % colors.length]
                const gradient = gradients[idx % gradients.length]

                return (
                  <div key={name} className={`p-6 rounded-2xl bg-black/40 border border-${color}-500/30 hover:border-${color}-500/70 hover:shadow-[0_0_30px_rgba(var(--${color}-rgb),0.2)] transition-all duration-500 group relative`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`}></div>
                    <div className="relative z-10">
                      <p className={`text-lg font-black font-mono text-${color}-400 drop-shadow-[0_0_8px_currentColor] mb-6 uppercase tracking-wider`}>{name}</p>
                      <div className="space-y-5">
                        {[
                          { label: 'ROC-AUC', value: metrics.roc_auc },
                          { label: 'Precision', value: metrics.precision },
                          { label: 'Recall', value: metrics.recall },
                          { label: 'F1-Score', value: metrics.f1 }
                        ].map((stat, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-2">
                              <span className="text-slate-400 font-mono tracking-widest uppercase">{stat.label}</span>
                              <span className={`font-bold font-mono text-${color}-300`}>{(stat.value * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-black/60 rounded-full h-1.5 overflow-hidden border border-white/5 relative">
                              <div 
                                className={`absolute left-0 top-0 bottom-0 bg-gradient-to-r ${gradient} shadow-[0_0_10px_currentColor] transition-all duration-1000 ease-out`} 
                                style={{ width: `${stat.value * 100}%` }} 
                              />
                            </div>
                          </div>
                        ))}
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
            <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>
              <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3 relative z-10">
                <span className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">🔧</span>
                <span>Feature Engineering Pipeline</span>
              </h3>
              <div className="relative z-10">
                <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent -translate-y-1/2"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                  {Object.entries(modelInfo.feature_engineering).map(([category, features]: [string, any], idx) => (
                    <div key={category} className={`p-6 rounded-2xl bg-black/60 border border-cyan-500/20 backdrop-blur-xl hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)] transition-all duration-500 transform ${idx % 2 === 0 ? 'md:-translate-y-4' : 'md:translate-y-4'}`}>
                      <div className="flex items-center space-x-3 mb-4 border-b border-white/5 pb-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_10px_rgba(34,211,238,0.3)] text-cyan-300 font-bold font-mono text-xs">{idx + 1}</div>
                        <p className="text-sm font-black text-white uppercase tracking-widest drop-shadow-[0_0_8px_currentColor]">
                          {category.replace(/_/g, ' ')}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(features) && features.map((feature: string, fIdx: number) => (
                          <span key={fIdx} className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs font-mono transition-all hover:bg-cyan-500/20 hover:scale-105 cursor-default shadow-sm">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Top Feature Importance */}
          {featureImportance?.feature_importance && (
            <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden">
              <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3">
                <span className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/30 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)]">⭐</span>
                <span>Top 10 Important Features</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(featureImportance.feature_importance)
                  .slice(0, 10)
                  .map(([feature, importance]: [string, any], idx: number) => {
                    const percentage = importance * 100
                    return (
                      <div key={idx} className="p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/20 transition-all duration-300 group flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center relative bg-black/60">
                          {/* Circular Progress logic roughly simulated with conic-gradient via inline style if possible, or just text */}
                          <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
                          <svg className="w-full h-full -rotate-90 absolute inset-0" viewBox="0 0 36 36">
                            <path
                              className="text-white/5"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none" stroke="currentColor" strokeWidth="2"
                            />
                            <path
                              className={`${idx < 3 ? 'text-yellow-400 drop-shadow-[0_0_5px_currentColor]' : 'text-purple-400'} transition-all duration-1000`}
                              strokeDasharray={`${percentage}, 100`}
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              fill="none" stroke="currentColor" strokeWidth="2"
                            />
                          </svg>
                          <span className={`text-[10px] font-bold font-mono ${idx < 3 ? 'text-yellow-400' : 'text-purple-400'}`}>#{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">{feature}</span>
                            <span className="text-xs font-mono text-slate-400">{percentage.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                            <div
                              className={`h-1 rounded-full bg-gradient-to-r ${idx < 3 ? 'from-yellow-500 to-orange-500' : 'from-purple-500 to-cyan-500'} shadow-[0_0_8px_currentColor]`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
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
          <div className="glass-panel rounded-2xl border border-white/5 p-6 relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center space-x-3 relative z-10">
              <span className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">📊</span>
              <span>Training Dataset Overview</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
              {[
                { label: 'Total Samples', value: modelInfo.dataset.total_samples?.toLocaleString(), desc: 'Training records', color: 'purple' },
                { label: 'Fraud Rate', value: `${(modelInfo.dataset.fraud_rate * 100).toFixed(2)}%`, desc: 'Class imbalance', color: 'red' },
                { label: 'Train Split', value: modelInfo.dataset.train_samples?.toLocaleString(), desc: '80% of dataset', color: 'blue' },
                { label: 'Test Split', value: modelInfo.dataset.test_samples?.toLocaleString(), desc: '20% of dataset', color: 'green' }
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-2xl bg-black/40 border border-${stat.color}-500/20 hover:border-${stat.color}-500/50 hover:shadow-[0_0_30px_rgba(var(--${stat.color}-rgb),0.15)] transition-all duration-300 group`}>
                  <p className={`text-xs font-mono text-${stat.color}-400 uppercase tracking-widest mb-3 group-hover:drop-shadow-[0_0_8px_currentColor]`}>{stat.label}</p>
                  <p className="text-3xl font-black font-mono text-white mb-2 tracking-tight">{stat.value}</p>
                  <p className="text-xs text-slate-500 font-mono">{stat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'drift' && driftData && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel rounded-2xl border border-white/5 p-8 relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className={`absolute top-0 left-0 w-64 h-64 rounded-full blur-[120px] -z-10 ${driftData.drift_detected ? 'bg-red-500/20' : 'bg-green-500/20'}`}></div>
            
            {/* Gauge */}
            <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                />
                <path
                  className={`${driftData.drift_detected ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]'} transition-all duration-1000`}
                  strokeDasharray={`${(driftData.drift_score / driftData.threshold) * 50}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none" stroke="currentColor" strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Drift Score</span>
                <span className={`text-4xl font-black font-mono ${driftData.drift_detected ? 'text-red-400' : 'text-green-400'}`}>
                  {driftData.drift_score.toFixed(3)}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-6 w-full">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-3 h-3 rounded-full animate-pulse ${driftData.drift_detected ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'}`}></div>
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {driftData.drift_detected ? 'Data Drift Detected' : 'No Data Drift Detected'}
                  </h3>
                </div>
                <p className="text-sm font-mono text-slate-400">Threshold limit: <span className="text-white">{driftData.threshold}</span></p>
              </div>

              {/* Terminal window for recommendation */}
              <div className="bg-black/80 rounded-xl border border-white/10 p-4 font-mono text-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-white/5"></div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                  <span className="ml-2 text-[10px] text-slate-500">drift-analysis.log</span>
                </div>
                <p className="text-slate-300">
                  <span className="text-green-400">➜</span> <span className="text-cyan-400">analysis</span> check-drift
                </p>
                <p className="text-slate-400 mt-2">
                  [{new Date(driftData.last_check).toLocaleTimeString()}] System recommendation:
                </p>
                <p className={`mt-1 font-bold ${driftData.drift_detected ? 'text-red-400' : 'text-green-400'}`}>
                  {driftData.recommendation}
                </p>
                {driftData.features_drifted?.length > 0 && (
                  <p className="mt-2 text-yellow-400">
                    Drifted features: {driftData.features_drifted.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
