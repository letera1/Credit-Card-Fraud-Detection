'use client'

import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Copy,
  Info,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { cn, DECISION_META, formatNumber, RISK_META } from '@/lib/utils'
import type { Decision, RiskLevel } from '@/types'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'icon' | 'icon-sm'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary-hover',
  secondary: 'border border-border-strong bg-surface text-foreground shadow-xs hover:bg-hover',
  ghost: 'text-muted-foreground hover:bg-hover hover:text-foreground',
  danger: 'border border-danger/30 bg-surface text-danger-fg shadow-xs hover:bg-danger/10',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 gap-1.5 px-3 text-13',
  md: 'h-9 gap-2 px-3.5 text-sm',
  icon: 'size-9',
  'icon-sm': 'size-8',
}

export function buttonStyles({
  variant = 'secondary',
  size = 'md',
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(
    'focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
    buttonVariants[variant],
    buttonSizes[size],
    className,
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={buttonStyles({ variant, size, className })} {...props} />
})

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-xl border border-border bg-surface shadow-xs dark:shadow-none', className)} {...props} />
}

export function CardHeader({
  title,
  description,
  action,
  className,
}: {
  title: ReactNode
  description?: ReactNode
  action?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex items-start justify-between gap-4 px-5 pt-5', className)}>
      <div className="min-w-0">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {description && <p className="mt-1 text-13 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  )
}

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}

const badgeBase = 'inline-flex items-center gap-1.5 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset'

export function Badge({ className, children }: { className?: string; children: ReactNode }) {
  return <span className={cn(badgeBase, 'bg-muted text-muted-foreground ring-border-strong/60', className)}>{children}</span>
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const meta = RISK_META[level] ?? RISK_META.LOW
  return (
    <span className={cn(badgeBase, meta.bg, meta.text, meta.ring)}>
      <span className={cn('size-1.5 rounded-full', meta.solid)} aria-hidden />
      {meta.label}
    </span>
  )
}

export function DecisionBadge({ decision }: { decision: Decision }) {
  const meta = DECISION_META[decision]
  return (
    <span className={cn(badgeBase, meta.bg, meta.text, meta.ring)}>
      <span className={cn('size-1.5 rounded-full', meta.solid)} aria-hidden />
      {meta.label}
    </span>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} aria-hidden />
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: LucideIcon
  title: string
  description?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-xs">
        <Icon className="size-5" aria-hidden />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-13 text-muted-foreground">{description}</p>}
      {children && <div className="mt-5 flex flex-wrap items-center justify-center gap-2">{children}</div>}
    </div>
  )
}

const calloutTones = {
  info: 'border-primary/20 bg-primary/5 [&>svg]:text-accent',
  warning: 'border-warning/30 bg-warning/5 [&>svg]:text-warning-fg',
  danger: 'border-danger/25 bg-danger/5 [&>svg]:text-danger-fg',
}

export function Callout({
  tone = 'info',
  title,
  children,
  action,
  className,
}: {
  tone?: keyof typeof calloutTones
  title?: string
  children?: ReactNode
  action?: ReactNode
  className?: string
}) {
  const Icon = tone === 'info' ? Info : CircleAlert
  return (
    <div role={tone === 'danger' ? 'alert' : undefined} className={cn('flex items-start gap-3 rounded-lg border px-4 py-3 text-13', calloutTones[tone], className)}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">
        {title && <p className="font-medium text-foreground">{title}</p>}
        {children && <div className={cn('text-muted-foreground', title && 'mt-0.5')}>{children}</div>}
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Callout
      tone="danger"
      title="Couldn't load data"
      action={onRetry && <Button size="sm" onClick={onRetry}><RefreshCw />Retry</Button>}
    >
      {message} Start the API with <code className="font-mono text-xs">uvicorn src.api.app:app --port 8000</code>.
    </Callout>
  )
}

const fieldStyles =
  'h-9 w-full rounded-lg border border-border-strong bg-surface text-sm text-foreground shadow-xs transition-shadow placeholder:text-subtle-foreground focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/15 disabled:opacity-50'

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn(fieldStyles, 'px-3', className)} {...props} />
})

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn('relative', className)}>
      <select className={cn(fieldStyles, 'appearance-none pl-3 pr-9')} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-subtle-foreground" aria-hidden />
    </div>
  )
}

export interface SegmentOption<T extends string> {
  value: T
  label: string
  count?: number
  icon?: LucideIcon
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
  label: string
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex max-w-full items-center gap-0.5 overflow-x-auto rounded-lg bg-muted p-0.5', className)}>
      {options.map((option) => {
        const active = option.value === value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.value)}
            className={cn(
              'focus-ring inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 text-13 font-medium transition-colors',
              active ? 'bg-surface text-foreground shadow-xs dark:bg-border-strong' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {Icon && <Icon className="size-3.5" aria-hidden />}
            {option.label}
            {option.count !== undefined && (
              <span className={cn('text-xs tabular-nums', active ? 'text-muted-foreground' : 'text-subtle-foreground')}>
                {formatNumber(option.count)}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border-strong bg-surface px-1 font-sans text-xs font-medium text-muted-foreground">
      {children}
    </kbd>
  )
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  className,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: LucideIcon
  className?: string
}) {
  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-13 font-medium text-muted-foreground">{label}</p>
        {Icon && <Icon className="size-4 text-subtle-foreground" aria-hidden />}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
      {hint && <p className="mt-1 text-xs text-subtle-foreground">{hint}</p>}
    </Card>
  )
}

export function DescriptionList({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn('divide-y divide-border', className)}>
      {items.map((item) => (
        <div key={item.label} className="flex items-center justify-between gap-6 py-3 text-13">
          <dt className="shrink-0 text-muted-foreground">{item.label}</dt>
          <dd className="min-w-0 text-right font-medium text-foreground">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }
  return (
    <Button variant="ghost" size="icon-sm" onClick={copy} aria-label={copied ? 'Copied' : label} title={copied ? 'Copied' : label}>
      {copied ? <Check className="text-success-fg" /> : <Copy />}
    </Button>
  )
}

export function ProgressBar({ value, label, className }: { value: number; label: string; className?: string }) {
  const percent = Math.max(0, Math.min(100, value))
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('h-1.5 w-full overflow-hidden rounded-full bg-muted', className)}
    >
      <div className="h-full rounded-full bg-primary transition-[width] duration-300" style={{ width: `${percent}%` }} />
    </div>
  )
}

export const table = {
  th: 'h-10 whitespace-nowrap px-4 text-xs font-medium text-muted-foreground',
  td: 'h-12 whitespace-nowrap px-4',
  headRow: 'border-b border-border bg-hover/60',
  row: 'border-b border-border transition-colors last:border-0 hover:bg-hover',
}

export type SortDirection = 'asc' | 'desc'

export function SortButton({ label, active, direction, onClick }: { label: string; active: boolean; direction: SortDirection; onClick: () => void }) {
  const Icon = !active ? ArrowUpDown : direction === 'asc' ? ArrowUp : ArrowDown
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('focus-ring -mx-1 inline-flex items-center gap-1 rounded px-1 transition-colors hover:text-foreground', active && 'text-foreground')}
    >
      {label}
      <Icon className="size-3.5" aria-hidden />
    </button>
  )
}

export function Pagination({
  page,
  pageCount,
  total,
  pageSize,
  onPageChange,
}: {
  page: number
  pageCount: number
  total: number
  pageSize: number
  onPageChange: (page: number) => void
}) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-13 text-muted-foreground">
      <p className="tabular-nums">
        {formatNumber(start)}–{formatNumber(end)} of {formatNumber(total)}
      </p>
      <div className="flex items-center gap-2">
        <Button size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          <ChevronLeft />
          Previous
        </Button>
        <Button size="sm" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  )
}
