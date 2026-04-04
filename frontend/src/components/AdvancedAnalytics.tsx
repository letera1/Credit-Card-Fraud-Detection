'use client'

import { useEffect, useState } from 'react'

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedMetric, setSelectedMetric] = useState('fraud_rate')

  // Mock data - replace with real API
  const metrics = {
    fraud_detection_rate: 98.7,
    false_positive_rate: 1.2,
    avg_processing_time: 14.5,
    total_amount_saved: 2847392,
    transactions_analyzed: 145892,
    fraud_prevented: 1247
  }

  const trendData = [
    { time: '00:00', fraud: 12, legitimate: 1234, medium: 45, high: 8 },
    { time: '04:00', fraud: 8, legitimate: 892, medium: 32, high: 5 },
    { time: '08:00', fraud: 23, legitimate: 2341, medium: 67, high: 15 },
    { time: '12:00', fraud: 34, legitimate: 3456, medium: 89, high: 22 },
    { time: '16:00', fraud: 28, legitimate: 2987, medium: 76, high: 18 },
    { time: '20:00', fraud: 19, legitimate: 1876, medium: 54, high: 12 },
  ]

  const topFeatures = [
    { name: 'V14', importance: 15.6, trend: '+2.3%', color: 'purple' },
    { name: 'V4', importance: 13.4, trend: '+1.8%', color: 'blue' },
    { name: 'V12', importance: 12.1, trend: '-0.5%', color: 'cyan' },
    { name: 'V10', importance: 9.8, trend: '+3.1%', color: 'green' },
    { name: 'V17', importance: 8.7, trend: '+0.9%', color: 'yellow' },
  ]

  const riskDistribution = [
    { level: 'LOW', count: 142345, percentage: 97.6, color: 'green' },
    { level: 'MEDIUM', count: 2134, percentage: 1.5, color: 'yellow' },
    { level: 'HIGH', count: 892, percentage: 0.6, color: 'orange' },
    { level: 'CRITICAL', count: 521, percentage: 0.3, color: 'red' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Deep Analytics</h2>
          <p className="text-sm text-slate-400">Advanced insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-purple-500/50"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Fraud Detection Rate */}
        <div className="glass-panel rounded-2xl p-6 border border-green-500/20 relative overflow-hidden group hover:border-green-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-green-400 uppercase tracking-widest">Detection Rate</p>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{metrics.fraud_detection_rate}%</p>
            <div className="flex items-center space-x-2 text-xs text-green-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>+2.3% from last period</span>
            </div>
          </div>
        </div>

        {/* False Positive Rate */}
        <div className="glass-panel rounded-2xl p-6 border border-blue-500/20 relative overflow-hidden group hover:border-blue-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-blue-400 uppercase tracking-widest">False Positive</p>
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{metrics.false_positive_rate}%</p>
            <div className="flex items-center space-x-2 text-xs text-blue-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <span>-0.8% improvement</span>
            </div>
          </div>
        </div>

        {/* Processing Time */}
        <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">Avg Response</p>
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-white mb-2">{metrics.avg_processing_time}ms</p>
            <div className="flex items-center space-x-2 text-xs text-purple-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Sub-20ms p99 latency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Impact & Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 border border-yellow-500/20">
          <p className="text-xs font-mono text-yellow-400 uppercase tracking-widest mb-4">Amount Saved</p>
          <p className="text-3xl font-bold text-white mb-2">${(metrics.total_amount_saved / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-slate-400">Fraud prevented this period</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20">
          <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-4">Transactions</p>
          <p className="text-3xl font-bold text-white mb-2">{(metrics.transactions_analyzed / 1000).toFixed(1)}K</p>
          <p className="text-xs text-slate-400">Analyzed in real-time</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 border border-red-500/20">
          <p className="text-xs font-mono text-red-400 uppercase tracking-widest mb-4">Fraud Blocked</p>
          <p className="text-3xl font-bold text-white mb-2">{metrics.fraud_prevented}</p>
          <p className="text-xs text-slate-400">Malicious attempts stopped</p>
        </div>
      </div>

      {/* Trend Chart & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend Chart */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Transaction Trends</h3>
          <div className="space-y-4">
            {trendData.map((data, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">{data.time}</span>
                  <span className="text-white font-mono">{data.fraud + data.legitimate + data.medium + data.high} total</span>
                </div>
                <div className="flex items-center space-x-1 h-8">
                  <div 
                    className="h-full bg-green-500 rounded-l transition-all hover:bg-green-400"
                    style={{ width: `${(data.legitimate / (data.fraud + data.legitimate + data.medium + data.high)) * 100}%` }}
                    title={`Legitimate: ${data.legitimate}`}
                  />
                  <div 
                    className="h-full bg-yellow-500 transition-all hover:bg-yellow-400"
                    style={{ width: `${(data.medium / (data.fraud + data.legitimate + data.medium + data.high)) * 100}%` }}
                    title={`Medium: ${data.medium}`}
                  />
                  <div 
                    className="h-full bg-orange-500 transition-all hover:bg-orange-400"
                    style={{ width: `${(data.high / (data.fraud + data.legitimate + data.medium + data.high)) * 100}%` }}
                    title={`High: ${data.high}`}
                  />
                  <div 
                    className="h-full bg-red-500 rounded-r transition-all hover:bg-red-400"
                    style={{ width: `${(data.fraud / (data.fraud + data.legitimate + data.medium + data.high)) * 100}%` }}
                    title={`Critical: ${data.fraud}`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-slate-400">Low</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span className="text-slate-400">Medium</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-slate-400">High</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-slate-400">Critical</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="glass-panel rounded-2xl p-6 border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Risk Distribution</h3>
          <div className="space-y-4">
            {riskDistribution.map((risk, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full bg-${risk.color}-500 shadow-[0_0_10px_currentColor]`}></div>
                    <span className="text-sm font-medium text-white">{risk.level}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{risk.count.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">{risk.percentage}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-${risk.color}-500 transition-all duration-1000`}
                    style={{ width: `${risk.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Features */}
      <div className="glass-panel rounded-2xl p-6 border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6">Top Fraud Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {topFeatures.map((feature, idx) => (
            <div key={idx} className={`bg-${feature.color}-500/10 border border-${feature.color}-500/30 rounded-xl p-4 hover:scale-105 transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-2xl font-bold text-${feature.color}-400`}>{feature.name}</span>
                <span className={`text-xs font-mono px-2 py-1 rounded bg-${feature.color}-500/20 text-${feature.color}-400`}>
                  #{idx + 1}
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{feature.importance}%</p>
              <p className={`text-xs font-mono text-${feature.color}-400`}>{feature.trend}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
