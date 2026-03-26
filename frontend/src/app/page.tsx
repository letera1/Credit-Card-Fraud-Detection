'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import RiskScoreCard from '@/components/RiskScoreCard'
import ThreatVirusChart from '@/components/ThreatVirusChart'
import PredictionForm from '@/components/PredictionForm'
import ResultCard from '@/components/ResultCard'
import TransactionHistory from '@/components/TransactionHistory'
import { PredictionResult } from '@/types'

export default function Home() {
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeView, setActiveView] = useState('overview')

  const riskMetrics = [
    { label: 'Total Threats', value: '132%', icon: '🔥', color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-500/10' },
    { label: 'Video File Risk', value: '16%', icon: '🎥', color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-500/10' },
    { label: 'Image File Risk', value: '43%', icon: '🖼️', color: 'from-pink-500 to-fuchsia-500', bgColor: 'bg-pink-500/10' },
    { label: 'Docs File Risk', value: '7%', icon: '📄', color: 'from-blue-500 to-indigo-500', bgColor: 'bg-blue-500/10' },
    { label: 'Folder File Risk', value: '66%', icon: '📁', color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10' },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Header />

        <main className="flex-1 p-6 overflow-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-xl">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Welcome! Kathryn Murphy</h1>
                <p className="text-sm text-muted-foreground">Security is a process, not a product.</p>
              </div>
            </div>
          </div>

          {/* Current Risk Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Current Risk</h2>
              <select className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {riskMetrics.map((metric, idx) => (
                <div key={idx} className={`${metric.bgColor} rounded-xl border border-border p-4 relative overflow-hidden group hover:scale-105 transition-transform`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${metric.color} flex items-center justify-center shadow-lg`}>
                      <span className="text-2xl">{metric.icon}</span>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Threat Summary Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Threat Summary</h3>
                <select className="px-3 py-1.5 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Yearly</option>
                  <option>Monthly</option>
                  <option>Weekly</option>
                </select>
              </div>

              {/* Chart Area */}
              <div className="relative h-64">
                <svg className="w-full h-full" viewBox="0 0 800 250">
                  {/* Grid lines */}
                  {[0, 100, 200, 300, 400, 500].map((y, idx) => (
                    <line
                      key={idx}
                      x1="0"
                      y1={250 - (y / 2)}
                      x2="800"
                      y2={250 - (y / 2)}
                      stroke="hsl(var(--border))"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  ))}

                  {/* Area chart */}
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d="M 0 150 Q 100 120, 200 140 T 400 100 T 600 130 T 800 180 L 800 250 L 0 250 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0 150 Q 100 120, 200 140 T 400 100 T 600 130 T 800 180"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                  />

                  {/* Data point */}
                  <circle cx="400" cy="100" r="6" fill="#a855f7" />
                  
                  {/* Tooltip */}
                  <g transform="translate(400, 60)">
                    <rect x="-40" y="-30" width="80" height="25" rx="6" fill="#a855f7" />
                    <text x="0" y="-12" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
                      APR 2024
                    </text>
                    <text x="0" y="0" textAnchor="middle" fill="white" fontSize="10">
                      Threats
                    </text>
                  </g>
                </svg>

                {/* Month labels */}
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                    <span key={month}>{month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Risk Score */}
            <RiskScoreCard score={741} maxScore={1000} />
          </div>

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Threat Details Table */}
            <div className="lg:col-span-2">
              <TransactionHistory />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Threats By Virus */}
              <ThreatVirusChart />

              {/* Threat by Device */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-foreground">Threat by device</h3>
                  <button className="text-muted-foreground hover:text-foreground">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'crazyfsh228', risk: 75, color: 'orange' },
                    { id: 'anyyyman-932', risk: 45, color: 'orange' },
                    { id: 'Device ID', risk: 85, color: 'red' },
                  ].map((device, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{idx === 0 ? 'Desktop' : idx === 1 ? 'Device ID' : 'Device ID'}</p>
                          <p className="text-xs text-muted-foreground">{device.id}</p>
                        </div>
                      </div>
                      <div className="relative w-12 h-12">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-secondary" />
                          <circle
                            cx="24"
                            cy="24"
                            r="20"
                            stroke={device.color === 'red' ? '#ef4444' : '#f97316'}
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${(device.risk / 100) * 125.6} 125.6`}
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

