import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import type { Decision, RiskLevel } from '@/types'

const twMerge = extendTailwindMerge({
  extend: { classGroups: { 'font-size': [{ text: ['13'] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const numberFormat = new Intl.NumberFormat('en-US')

export function formatNumber(value: number) {
  return numberFormat.format(value)
}

/** Formats a 0–1 ratio as a percentage. */
export function formatPercent(ratio: number, digits = 1) {
  return `${(ratio * 100).toFixed(digits)}%`
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

export function formatRelativeTime(iso: string, now = Date.now()) {
  const seconds = Math.round((now - new Date(iso).getTime()) / 1000)
  if (Number.isNaN(seconds)) return '—'
  if (seconds < 45) return 'Just now'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return formatDateTime(iso)
}

export const RISK_LEVELS: RiskLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

interface Tone {
  label: string
  text: string
  bg: string
  ring: string
  solid: string
}

export const RISK_META: Record<RiskLevel, Tone & { range: string }> = {
  LOW: { label: 'Low', range: '0–29', text: 'text-success-fg', bg: 'bg-success/10', ring: 'ring-success/20', solid: 'bg-success' },
  MEDIUM: { label: 'Medium', range: '30–59', text: 'text-warning-fg', bg: 'bg-warning/10', ring: 'ring-warning/25', solid: 'bg-warning' },
  HIGH: { label: 'High', range: '60–79', text: 'text-orange-fg', bg: 'bg-orange/10', ring: 'ring-orange/20', solid: 'bg-orange' },
  CRITICAL: { label: 'Critical', range: '80–100', text: 'text-danger-fg', bg: 'bg-danger/10', ring: 'ring-danger/20', solid: 'bg-danger' },
}

export const DECISION_META: Record<Decision, Tone> = {
  APPROVE: { label: 'Approve', text: 'text-success-fg', bg: 'bg-success/10', ring: 'ring-success/20', solid: 'bg-success' },
  REVIEW: { label: 'Review', text: 'text-warning-fg', bg: 'bg-warning/10', ring: 'ring-warning/25', solid: 'bg-warning' },
  BLOCK: { label: 'Block', text: 'text-danger-fg', bg: 'bg-danger/10', ring: 'ring-danger/20', solid: 'bg-danger' },
}

/** The API returns actions like "BLOCK - Immediate intervention required". */
export function parseAction(action: string): { decision: Decision; detail: string } {
  const [head, ...rest] = action.split(' - ')
  const decision = (['APPROVE', 'REVIEW', 'BLOCK'] as const).find((d) => head.trim().toUpperCase() === d) ?? 'REVIEW'
  return { decision, detail: rest.join(' - ').trim() }
}

export function riskLevelFor(score: number): RiskLevel {
  if (score >= 80) return 'CRITICAL'
  if (score >= 60) return 'HIGH'
  if (score >= 30) return 'MEDIUM'
  return 'LOW'
}

export function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/** Quotes CSV cells that contain separators, quotes or newlines. */
export function toCsv(rows: (string | number | boolean)[][]) {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const text = String(cell)
          return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
        })
        .join(','),
    )
    .join('\n')
}
