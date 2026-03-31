'use client'

import { useEffect, useState } from 'react'

interface RiskScoreCardProps {
  score: number
  maxScore: number
  label: string
}

export default function RiskScoreCard({ score, maxScore, label }: RiskScoreCardProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  
  useEffect(() => {
    // Animate score from 0 to actual value
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 300)
    return () => clearTimeout(timer)
  }, [score])

  const percentage = (animatedScore / maxScore) * 100
  
  // Choose color based on risk severity
  let colorClass = 'text-green-500'
  let strokeClass = 'stroke-green-500'
  let glowClass = 'shadow-[0_0_30px_rgba(34,197,94,0.3)]'
  let labelText = 'SAFE'
  
  if (percentage >= 80) {
    colorClass = 'text-red-500'
    strokeClass = 'stroke-red-500'
    glowClass = 'shadow-[0_0_40px_rgba(239,68,68,0.5)]'
    labelText = 'CRITICAL'
  } else if (percentage >= 60) {
    colorClass = 'text-orange-500'
    strokeClass = 'stroke-orange-500'
    glowClass = 'shadow-[0_0_30px_rgba(249,115,22,0.4)]'
    labelText = 'HIGH RISK'
  } else if (percentage >= 30) {
    colorClass = 'text-yellow-500'
    strokeClass = 'stroke-yellow-500'
    glowClass = 'shadow-[0_0_30px_rgba(234,179,8,0.3)]'
    labelText = 'MODERATE'
  }

  // SVG Circle math
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="glass-panel rounded-2xl p-6 h-full flex flex-col items-center justify-center relative overflow-hidden group">
      {/* Background glow mesh */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-20 transition-colors duration-700 ${
        percentage >= 80 ? 'bg-red-600' :
        percentage >= 60 ? 'bg-orange-600' :
        percentage >= 30 ? 'bg-yellow-600' : 'bg-green-600'
      }`}></div>

      <p className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-widest absolute top-6 left-6 flex items-center">
        <svg className="w-3 h-3 mr-2 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        {label}
      </p>

      {/* SVG Radial Gauge */}
      <div className="relative w-40 h-40 mt-6 flex items-center justify-center">
        {/* Track Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            className="stroke-white/5"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            className={`${strokeClass} drop-shadow-[0_0_8px_currentColor] transition-all duration-1000 ease-out`}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-mono font-bold tracking-tighter ${colorClass}`}>
            {animatedScore.toFixed(0)}
          </span>
          <span className="text-[10px] text-slate-500 font-mono mt-1">/100</span>
        </div>
      </div>

      <div className="mt-6 text-center z-10">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-widest border border-current ${colorClass} bg-current/10`}>
          {labelText} STATUS
        </span>
      </div>
    </div>
  )
}
