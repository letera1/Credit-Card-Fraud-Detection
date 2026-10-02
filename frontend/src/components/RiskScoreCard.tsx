import { cn, RISK_META, riskLevelFor } from '@/lib/utils'

const BANDS = [
  { from: 0, to: 30, className: 'bg-success/25' },
  { from: 30, to: 60, className: 'bg-warning/30' },
  { from: 60, to: 80, className: 'bg-orange/30' },
  { from: 80, to: 100, className: 'bg-danger/30' },
]

const TICKS = [0, 30, 60, 80, 100]

/** Horizontal 0–100 meter showing where a score falls across the risk bands. */
export default function RiskScoreCard({ score }: { score: number }) {
  const value = Math.max(0, Math.min(100, score))
  const level = riskLevelFor(value)

  return (
    <div role="img" aria-label={`Risk score ${value} of 100, ${RISK_META[level].label.toLowerCase()} risk`}>
      <div className="relative h-2">
        <div className="flex h-full overflow-hidden rounded-full">
          {BANDS.map((band) => (
            <div key={band.from} className={band.className} style={{ width: `${band.to - band.from}%` }} />
          ))}
        </div>
        <div
          className={cn(
            'absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-surface shadow-sm',
            RISK_META[level].solid,
          )}
          style={{ left: `${value}%` }}
        />
      </div>
      <div className="relative mt-2 h-4 text-xs tabular-nums text-subtle-foreground" aria-hidden>
        {TICKS.map((tick) => (
          <span
            key={tick}
            className={cn('absolute', tick === 0 ? 'left-0' : tick === 100 ? 'right-0' : '-translate-x-1/2')}
            style={tick > 0 && tick < 100 ? { left: `${tick}%` } : undefined}
          >
            {tick}
          </span>
        ))}
      </div>
    </div>
  )
}
