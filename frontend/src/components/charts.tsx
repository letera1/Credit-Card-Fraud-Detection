import type { ReactNode } from 'react'
import { cn, formatNumber } from '@/lib/utils'
import type { ShapFeature } from '@/types'

export interface BarItem {
  key: string
  label: ReactNode
  value: number
  display?: ReactNode
  barClassName?: string
}

export function BarList({ items, className }: { items: BarItem[]; className?: string }) {
  const max = Math.max(1e-9, ...items.map((item) => item.value))
  return (
    <ul className={cn('space-y-3.5', className)}>
      {items.map((item) => (
        <li key={item.key}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-13">
            <span className="min-w-0 truncate text-foreground">{item.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{item.display ?? formatNumber(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn('h-full rounded-full bg-primary', item.barClassName)}
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export interface Column {
  key: string
  label: string
  value: number
  highlight?: number
  title: string
  barClassName?: string
}

/** Vertical bars; `highlight` draws a red portion at the bottom of each bar. */
export function ColumnChart({ columns, height = 168, labelEvery = 1 }: { columns: Column[]; height?: number; labelEvery?: number }) {
  const max = Math.max(1, ...columns.map((column) => column.value))
  return (
    <div>
      <div className="flex items-end gap-1 border-b border-border" style={{ height }}>
        {columns.map((column) => (
          <div key={column.key} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={column.title}>
            <div
              className={cn('flex w-full max-w-11 flex-col justify-end overflow-hidden rounded-t-[3px] bg-primary', column.barClassName)}
              style={{ height: `${(column.value / max) * 100}%`, minHeight: column.value > 0 ? 2 : 0 }}
            >
              {!!column.highlight && (
                <div className="w-full bg-danger" style={{ height: `${(column.highlight / column.value) * 100}%` }} />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 text-xs text-subtle-foreground">
        {columns.map((column, index) => (
          <span key={column.key} className="min-w-0 flex-1 truncate text-center tabular-nums">
            {index % labelEvery === 0 ? column.label : ''}
          </span>
        ))}
      </div>
    </div>
  )
}

const formatInput = (value: number) =>
  Math.abs(value) >= 1000 ? formatNumber(Math.round(value)) : Number(value.toFixed(3)).toString()

/** Diverging bars around zero; positive SHAP values push the prediction toward fraud. */
export function ShapChart({ features, className }: { features: ShapFeature[]; className?: string }) {
  const max = Math.max(1e-9, ...features.map((feature) => Math.abs(feature.shap_value)))
  return (
    <ul className={cn('space-y-3', className)}>
      {features.map((feature) => {
        const positive = feature.shap_value > 0
        const width = (Math.abs(feature.shap_value) / max) * 50
        return (
          <li key={feature.feature} className="grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)_4.5rem] items-center gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-xs font-medium text-foreground">{feature.feature}</p>
              <p className="truncate text-xs tabular-nums text-subtle-foreground">value {formatInput(feature.value)}</p>
            </div>
            <div className="relative h-2 rounded-full bg-muted">
              <div className="absolute inset-y-[-3px] left-1/2 w-px bg-border-strong" aria-hidden />
              <div
                className={cn('absolute inset-y-0 rounded-full', positive ? 'left-1/2 bg-danger' : 'right-1/2 bg-success')}
                style={{ width: `${width}%` }}
              />
            </div>
            <span className={cn('text-right font-mono text-xs tabular-nums', positive ? 'text-danger-fg' : 'text-success-fg')}>
              {positive ? '+' : '−'}
              {Math.abs(feature.shap_value).toFixed(3)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
