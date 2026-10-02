'use client'

import { useState } from 'react'
import { LoaderCircle, Monitor, Moon, RefreshCw, Sun, Trash2 } from 'lucide-react'
import { Dialog } from '@/components/overlays'
import { Button, Callout, Card, CardHeader, DescriptionList, Kbd, PageHeader, Segmented } from '@/components/ui'
import { useTheme, type ThemePreference } from '@/contexts/ThemeContext'
import { API_URL, getErrorMessage, getHealth, resetRuntimeData } from '@/lib/api'
import { ALERTS_CHANGED_EVENT, useModifierKey, usePolling } from '@/lib/hooks'
import { cn, formatNumber } from '@/lib/utils'

function StatusText({ state }: { state: 'checking' | 'connected' | 'offline' }) {
  const label = { checking: 'Checking…', connected: 'Connected', offline: 'Unreachable' }[state]
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={cn('size-2 rounded-full', state === 'connected' ? 'bg-success' : state === 'offline' ? 'bg-danger' : 'bg-subtle-foreground')}
        aria-hidden
      />
      {label}
    </span>
  )
}

export default function Settings() {
  const { preference, setPreference } = useTheme()
  const modifier = useModifierKey()
  const health = usePolling(getHealth, 0)
  const [latency, setLatency] = useState<number | null>(null)
  const [testing, setTesting] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [resetResult, setResetResult] = useState<{ ok: boolean; message: string } | null>(null)

  const testConnection = async () => {
    setTesting(true)
    const started = performance.now()
    await health.refresh()
    setLatency(Math.round(performance.now() - started))
    setTesting(false)
  }

  const clearRuntimeData = async () => {
    setResetting(true)
    try {
      await resetRuntimeData()
      setResetResult({ ok: true, message: 'Runtime data cleared. Transactions, alerts and risk profiles were removed.' })
      window.dispatchEvent(new Event(ALERTS_CHANGED_EVENT))
      health.refresh()
    } catch (error) {
      setResetResult({ ok: false, message: getErrorMessage(error) })
    } finally {
      setResetting(false)
      setResetOpen(false)
    }
  }

  const state = health.error ? 'offline' : health.data ? 'connected' : 'checking'
  const h = health.data

  const shortcuts = [
    { label: 'Open the command menu', keys: [modifier, 'K'] },
    { label: 'Collapse or expand the sidebar', keys: [modifier, 'B'] },
    { label: 'Go to a page, in sidebar order', keys: ['1', '–', '9'] },
    { label: 'Score the payload on Score transaction', keys: [modifier, 'Enter'] },
    { label: 'Close a panel or dialog', keys: ['Esc'] },
  ]

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Settings" description="Appearance, API connection and runtime data." />

      <Card>
        <CardHeader title="Appearance" description="System follows your operating system's light or dark setting." />
        <div className="p-5">
          <Segmented<ThemePreference>
            label="Theme"
            value={preference}
            onChange={setPreference}
            options={[
              { value: 'system', label: 'System', icon: Monitor },
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
            ]}
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="API connection"
          description="The scoring service this dashboard talks to."
          action={
            <Button size="sm" onClick={testConnection} disabled={testing}>
              {testing ? <LoaderCircle className="animate-spin" /> : <RefreshCw />}
              Test connection
            </Button>
          }
        />
        <div className="px-5 pb-2 pt-3">
          {health.error && (
            <Callout tone="danger" className="mb-2">
              {health.error}
            </Callout>
          )}
          <DescriptionList
            items={[
              { label: 'Endpoint', value: <span className="font-mono text-xs">{API_URL}</span> },
              { label: 'Status', value: <StatusText state={state} /> },
              { label: 'Round-trip time', value: latency !== null && !health.error ? `${latency} ms` : 'Not measured' },
              { label: 'API version', value: h?.version ?? '—' },
              { label: 'Model', value: h ? (h.model_loaded ? 'Loaded' : 'Not loaded') : '—' },
              { label: 'SHAP explanations', value: h ? (h.shap_available ? 'Available' : 'Unavailable') : '—' },
              { label: 'Transactions in memory', value: <span className="tabular-nums">{h ? formatNumber(h.transactions_processed) : '—'}</span> },
              { label: 'Active alerts', value: <span className="tabular-nums">{h ? formatNumber(h.active_alerts) : '—'}</span> },
            ]}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="Keyboard shortcuts" />
        <ul className="mt-2 divide-y divide-border px-5 pb-2">
          {shortcuts.map((shortcut) => (
            <li key={shortcut.label} className="flex items-center justify-between gap-4 py-3 text-13">
              <span className="text-muted-foreground">{shortcut.label}</span>
              <span className="flex items-center gap-1">
                {shortcut.keys.map((key, index) =>
                  key === '–' ? (
                    <span key={index} className="text-subtle-foreground">
                      –
                    </span>
                  ) : (
                    <Kbd key={index}>{key}</Kbd>
                  ),
                )}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader
          title="Runtime data"
          description="Scored transactions, alerts and risk profiles live in API memory and reset when the API restarts."
        />
        <div className="space-y-4 p-5">
          {resetResult && (
            <Callout tone={resetResult.ok ? 'info' : 'danger'} title={resetResult.ok ? undefined : "Couldn't clear runtime data"}>
              {resetResult.message}
            </Callout>
          )}
          <div className="flex flex-col gap-3 rounded-lg border border-danger/25 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-13 font-medium text-foreground">Clear runtime data</p>
              <p className="mt-0.5 text-13 text-muted-foreground">Removes everything the API has scored so far. Model files aren&apos;t affected.</p>
            </div>
            <Button variant="danger" onClick={() => setResetOpen(true)}>
              <Trash2 />
              Clear data
            </Button>
          </div>
        </div>
      </Card>

      <Dialog
        open={resetOpen}
        onClose={() => !resetting && setResetOpen(false)}
        title="Clear runtime data?"
        description="This removes every scored transaction, alert and risk profile from the API's memory. It can't be undone."
        footer={
          <>
            <Button onClick={() => setResetOpen(false)} disabled={resetting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={clearRuntimeData} disabled={resetting}>
              {resetting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
              Clear data
            </Button>
          </>
        }
      />
    </div>
  )
}
