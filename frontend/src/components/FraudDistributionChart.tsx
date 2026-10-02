import { Card, CardHeader } from '@/components/ui'
import { cn, DECISION_META, formatNumber, formatPercent, parseAction, RISK_LEVELS, RISK_META } from '@/lib/utils'
import type { Decision, RiskLevel } from '@/types'

export function countByRiskLevel(items: { risk_level: RiskLevel }[]) {
  const counts: Record<RiskLevel, number> = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 }
  items.forEach((item) => {
    if (item.risk_level in counts) counts[item.risk_level] += 1
  })
  return counts
}

export function RiskDistribution({ counts }: { counts: Record<RiskLevel, number> }) {
  const total = RISK_LEVELS.reduce((sum, level) => sum + counts[level], 0)
  const summary = RISK_LEVELS.map((level) => `${RISK_META[level].label} ${counts[level]}`).join(', ')

  return (
    <div>
      <div className="flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full bg-muted" role="img" aria-label={`Risk distribution: ${summary}`}>
        {RISK_LEVELS.map(
          (level) =>
            counts[level] > 0 && (
              <div key={level} className={cn('h-full', RISK_META[level].solid)} style={{ width: `${(counts[level] / total) * 100}%` }} />
            ),
        )}
      </div>
      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
        {RISK_LEVELS.map((level) => (
          <div key={level}>
            <dt className="flex items-center gap-2 text-13 text-muted-foreground">
              <span className={cn('size-2 rounded-full', RISK_META[level].solid)} aria-hidden />
              {RISK_META[level].label}
              <span className="text-xs tabular-nums text-subtle-foreground">{RISK_META[level].range}</span>
            </dt>
            <dd className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tabular-nums text-foreground">{formatNumber(counts[level])}</span>
              <span className="text-xs tabular-nums text-subtle-foreground">{total ? formatPercent(counts[level] / total, 0) : '0%'}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function FraudDistributionChart({
  transactions,
  total,
  className,
}: {
  transactions: { risk_level: RiskLevel; recommended_action: string }[]
  total: number
  className?: string
}) {
  const description =
    total > transactions.length
      ? `Latest ${formatNumber(transactions.length)} of ${formatNumber(total)} scored transactions`
      : `All ${formatNumber(total)} scored transactions`

  const decisions: Record<Decision, number> = { APPROVE: 0, REVIEW: 0, BLOCK: 0 }
  transactions.forEach((tx) => {
    decisions[parseAction(tx.recommended_action).decision] += 1
  })

  return (
    <Card className={cn('flex flex-col', className)}>
      <CardHeader title="Risk distribution" description={description} />
      <div className="p-5">
        <RiskDistribution counts={countByRiskLevel(transactions)} />
      </div>
      <div className="mt-auto border-t border-border p-5">
        <h3 className="text-13 font-medium text-foreground">Decisions</h3>
        <dl className="mt-3 grid grid-cols-3 gap-4">
          {(Object.keys(decisions) as Decision[]).map((decision) => (
            <div key={decision} className="rounded-lg bg-hover px-4 py-3">
              <dt className="flex items-center gap-2 text-13 text-muted-foreground">
                <span className={cn('size-2 rounded-full', DECISION_META[decision].solid)} aria-hidden />
                {DECISION_META[decision].label}
              </dt>
              <dd className="mt-1 flex items-baseline gap-1.5">
                <span className="text-lg font-semibold tabular-nums text-foreground">{formatNumber(decisions[decision])}</span>
                <span className="text-xs tabular-nums text-subtle-foreground">
                  {transactions.length ? formatPercent(decisions[decision] / transactions.length, 0) : '0%'}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Card>
  )
}
