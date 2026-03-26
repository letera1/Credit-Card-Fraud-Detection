'use client'

interface RiskScoreCardProps {
  score: number
  maxScore?: number
  label?: string
}

export default function RiskScoreCard({ score, maxScore = 100, label = 'Average Risk Score' }: RiskScoreCardProps) {
  const percentage = (score / maxScore) * 100
  const circumference = 2 * Math.PI * 70
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  // Determine risk level and color
  const getRiskLevel = () => {
    if (score >= 80) return { level: 'Critical', color: '#ef4444' }
    if (score >= 60) return { level: 'High', color: '#f97316' }
    if (score >= 30) return { level: 'Medium', color: '#eab308' }
    return { level: 'Low', color: '#22c55e' }
  }

  const risk = getRiskLevel()

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">{label}</h3>
        <button className="text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-center">
        <div className="relative w-48 h-48">
          {/* Background Circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-secondary"
            />
            {/* Progress Circle */}
            <circle
              cx="96"
              cy="96"
              r="70"
              stroke={risk.color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Score</p>
              <p className="text-4xl font-bold text-foreground">{score}</p>
              <div className="mt-3 px-3 py-1 rounded-full border" style={{ 
                backgroundColor: `${risk.color}20`, 
                borderColor: `${risk.color}30` 
              }}>
                <p className="text-xs font-medium" style={{ color: risk.color }}>{risk.level}</p>
              </div>
            </div>
          </div>

          {/* Min/Max Labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground px-2">
            <span>0</span>
            <span>{maxScore}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
