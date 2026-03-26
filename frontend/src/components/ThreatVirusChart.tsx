'use client'

export default function ThreatVirusChart() {
  const threats = [
    { name: 'BONYPOD', percentage: 25, color: '#a855f7' },
    { name: 'Malware', percentage: 20, color: '#ec4899' },
    { name: 'Trojan', percentage: 30, color: '#3b82f6' },
    { name: 'Spear', percentage: 25, color: '#06b6d4' },
  ]

  // Calculate donut segments
  let currentAngle = 0
  const segments = threats.map((threat) => {
    const angle = (threat.percentage / 100) * 360
    const segment = {
      ...threat,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    }
    currentAngle += angle
    return segment
  })

  return (
    <div className="bg-card rounded-xl border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-foreground">Threats By Virus</h3>
        <button className="text-muted-foreground hover:text-foreground">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        {/* Legend */}
        <div className="space-y-3 flex-1">
          {threats.map((threat, idx) => (
            <div key={idx} className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: threat.color }}
              />
              <span className="text-sm text-muted-foreground">{threat.name}</span>
            </div>
          ))}
        </div>

        {/* Donut Chart */}
        <div className="relative w-32 h-32">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {segments.map((segment, idx) => {
              const startAngle = (segment.startAngle * Math.PI) / 180
              const endAngle = (segment.endAngle * Math.PI) / 180
              const largeArcFlag = segment.endAngle - segment.startAngle > 180 ? 1 : 0

              const startX = 50 + 35 * Math.cos(startAngle)
              const startY = 50 + 35 * Math.sin(startAngle)
              const endX = 50 + 35 * Math.cos(endAngle)
              const endY = 50 + 35 * Math.sin(endAngle)

              return (
                <path
                  key={idx}
                  d={`M 50 50 L ${startX} ${startY} A 35 35 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                  fill={segment.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              )
            })}
            {/* Center white circle */}
            <circle cx="50" cy="50" r="20" fill="hsl(var(--card))" />
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-foreground">65%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
