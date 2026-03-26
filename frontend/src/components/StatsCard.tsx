'use client'

interface Props {
  icon: string
  title: string
  value: string
  description: string
  trend?: 'up' | 'down' | 'stable'
}

export default function StatsCard({ icon, title, value, description, trend = 'stable' }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
      
      {/* Trend Indicator */}
      {trend !== 'stable' && (
        <div className="mt-4 flex items-center space-x-1">
          {trend === 'up' ? (
            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          )}
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {trend === 'up' ? 'Improving' : 'Declining'}
          </span>
        </div>
      )}
    </div>
  )
}
