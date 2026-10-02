'use client'

import { useEffect, useRef, useState, type DragEvent } from 'react'
import { Download, FileJson, Layers, LoaderCircle, Trash2, Upload } from 'lucide-react'
import { countByRiskLevel, RiskDistribution } from '@/components/FraudDistributionChart'
import { Sheet } from '@/components/overlays'
import TransactionDetail from '@/components/TransactionDetail'
import {
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  DecisionLabel,
  PageHeader,
  Pagination,
  ProgressBar,
  RiskBadge,
  StatCard,
  table,
} from '@/components/ui'
import { getErrorMessage, predictTransaction } from '@/lib/api'
import { SAMPLES, validateTransaction } from '@/lib/samples'
import { cn, downloadFile, formatNumber, formatPercent, parseAction, toCsv } from '@/lib/utils'
import type { PredictionResult, TransactionInput } from '@/types'

const MAX_TRANSACTIONS = 1000
const MAX_FILE_BYTES = 5 * 1024 * 1024
const CONCURRENCY = 10
const PAGE_SIZE = 20

interface BatchRow {
  index: number
  input: TransactionInput
  result?: PredictionResult
  error?: string
}

export default function BatchProcessing() {
  const [fileName, setFileName] = useState<string | null>(null)
  const [items, setItems] = useState<TransactionInput[]>([])
  const [fileError, setFileError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [running, setRunning] = useState(false)
  const [rows, setRows] = useState<BatchRow[]>([])
  const [duration, setDuration] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<BatchRow | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => () => abortRef.current?.abort(), [])

  const clear = () => {
    setFileName(null)
    setItems([])
    setFileError(null)
    setRows([])
    setDuration(null)
    setPage(1)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const loadFile = async (file: File) => {
    clear()
    setFileName(file.name)
    if (!file.name.toLowerCase().endsWith('.json')) return setFileError('Choose a .json file.')
    if (file.size > MAX_FILE_BYTES) return setFileError('The file is larger than 5 MB.')
    let parsed: unknown
    try {
      parsed = JSON.parse(await file.text())
    } catch {
      return setFileError('The file is not valid JSON.')
    }
    if (!Array.isArray(parsed)) return setFileError('Expected a JSON array of transactions.')
    if (!parsed.length) return setFileError('The file contains no transactions.')
    if (parsed.length > MAX_TRANSACTIONS) {
      return setFileError(`The file has ${formatNumber(parsed.length)} transactions; the limit is ${formatNumber(MAX_TRANSACTIONS)}.`)
    }
    const valid: TransactionInput[] = []
    for (const [index, entry] of parsed.entries()) {
      const validation = validateTransaction(entry)
      if (!validation.ok) return setFileError(`Transaction ${index + 1}: ${validation.error}`)
      valid.push(validation.data)
    }
    setItems(valid)
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.files?.[0]
    if (file) loadFile(file)
  }

  const run = async () => {
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setRows([])
    setDuration(null)
    setPage(1)
    const start = performance.now()
    const output: BatchRow[] = []

    for (let offset = 0; offset < items.length; offset += CONCURRENCY) {
      const chunk = await Promise.all(
        items.slice(offset, offset + CONCURRENCY).map(async (input, i): Promise<BatchRow> => {
          try {
            return { index: offset + i, input, result: await predictTransaction(input, controller.signal) }
          } catch (error) {
            return { index: offset + i, input, error: getErrorMessage(error) }
          }
        }),
      )
      if (controller.signal.aborted) break
      output.push(...chunk)
      setRows([...output])
    }

    setDuration((performance.now() - start) / 1000)
    setRunning(false)
    abortRef.current = null
  }

  const scored = rows.filter((row) => row.result).map((row) => row.result as PredictionResult)
  const failed = rows.length - scored.length
  const flagged = scored.filter((result) => result.is_fraud).length
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const stamp = () => new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')

  const exportCsv = () => {
    const header = ['row', 'transaction_id', 'risk_level', 'risk_score', 'fraud_probability', 'is_fraud', 'decision', 'anomaly_flags', 'error']
    const body = rows.map(({ index, result, error }) => [
      index + 1,
      result?.transaction_id ?? '',
      result?.risk_level ?? '',
      result?.risk_score ?? '',
      result?.fraud_probability ?? '',
      result?.is_fraud ?? '',
      result ? parseAction(result.recommended_action).decision : '',
      result?.anomaly_flags.join('; ') ?? '',
      error ?? '',
    ])
    downloadFile(`batch-results-${stamp()}.csv`, toCsv([header, ...body]), 'text/csv')
  }

  const exportJson = () => {
    const payload = rows.map(({ index, result, error }) => ({ row: index + 1, ...(result ?? { error }) }))
    downloadFile(`batch-results-${stamp()}.json`, JSON.stringify(payload, null, 2), 'application/json')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Batch scoring"
        description="Score a JSON file of transactions. Each transaction is sent to the model and recorded like a single score."
      />

      <Card>
        <CardHeader
          title="Upload file"
          description={`A JSON array of up to ${formatNumber(MAX_TRANSACTIONS)} transactions with the same fields as single scoring.`}
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                downloadFile('fraudshield-sample-batch.json', JSON.stringify(SAMPLES.map((sample) => sample.data), null, 2), 'application/json')
              }
            >
              <Download />
              Sample file
            </Button>
          }
        />
        <div className="space-y-4 p-5">
          <div
            onDragOver={(event) => {
              event.preventDefault()
              setDragging(true)
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              'flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-10 text-center transition-colors',
              dragging ? 'border-primary bg-primary/5' : 'border-border-strong bg-background',
            )}
          >
            <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground shadow-xs">
              <Upload className="size-5" aria-hidden />
            </div>
            <p className="mt-3 text-sm text-foreground">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={running}
                className="focus-ring rounded font-semibold text-accent hover:underline disabled:opacity-50"
              >
                Choose a file
              </button>{' '}
              or drag it here
            </p>
            <p className="mt-1 text-xs text-subtle-foreground">.json, up to 5 MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) loadFile(file)
              }}
            />
          </div>

          {fileName && (
            <div className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
              <FileJson className="size-5 shrink-0 text-subtle-foreground" aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="truncate text-13 font-medium text-foreground">{fileName}</p>
                <p className={cn('text-xs', fileError ? 'text-danger-fg' : 'text-subtle-foreground')}>
                  {fileError ?? `${formatNumber(items.length)} valid transactions`}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={clear} disabled={running} aria-label="Remove file">
                <Trash2 />
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center">
          {running ? (
            <div className="flex flex-1 items-center gap-3">
              <ProgressBar value={(rows.length / items.length) * 100} label="Batch progress" className="max-w-sm" />
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {formatNumber(rows.length)} of {formatNumber(items.length)}
              </span>
            </div>
          ) : (
            <span className="flex-1" />
          )}
          <div className="flex justify-end gap-2">
            {running && <Button onClick={() => abortRef.current?.abort()}>Cancel</Button>}
            <Button variant="primary" disabled={!items.length || running} onClick={run}>
              {running ? <LoaderCircle className="animate-spin" /> : <Layers />}
              {running ? 'Scoring…' : items.length ? `Score ${formatNumber(items.length)} transactions` : 'Score transactions'}
            </Button>
          </div>
        </div>
      </Card>

      {rows.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Scored" value={formatNumber(scored.length)} hint={`of ${formatNumber(items.length)} in the file`} />
            <StatCard
              label="Flagged as fraud"
              value={formatNumber(flagged)}
              hint={scored.length ? `${formatPercent(flagged / scored.length)} of scored` : undefined}
            />
            <StatCard label="Failed" value={formatNumber(failed)} hint={failed ? 'See the error column' : 'No request errors'} />
            <StatCard label="Duration" value={duration === null ? '—' : `${duration.toFixed(1)}s`} hint={running ? 'In progress' : undefined} />
          </div>

          <Card>
            <CardHeader title="Risk distribution" description="Across successfully scored transactions" />
            <div className="p-5">
              <RiskDistribution counts={countByRiskLevel(scored)} />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Results"
              description="Select a row to see its explanation"
              action={
                <>
                  <Button size="sm" onClick={exportCsv} disabled={running}>
                    <Download />
                    CSV
                  </Button>
                  <Button size="sm" onClick={exportJson} disabled={running}>
                    <Download />
                    JSON
                  </Button>
                </>
              }
            />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-13">
                <thead>
                  <tr className={table.headRow}>
                    <th scope="col" className={cn(table.th, 'w-14 text-right')}>Row</th>
                    <th scope="col" className={table.th}>Transaction</th>
                    <th scope="col" className={table.th}>Risk level</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Risk score</th>
                    <th scope="col" className={cn(table.th, 'text-right')}>Probability</th>
                    <th scope="col" className={table.th}>Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row) => (
                    <tr
                      key={row.index}
                      onClick={() => row.result && setSelected(row)}
                      className={cn(table.row, row.result && 'cursor-pointer')}
                    >
                      <td className={cn(table.td, 'text-right tabular-nums text-subtle-foreground')}>{row.index + 1}</td>
                      {row.result ? (
                        <>
                          <td className={cn(table.td, 'font-mono text-xs text-foreground')}>{row.result.transaction_id}</td>
                          <td className={table.td}>
                            <RiskBadge level={row.result.risk_level} />
                          </td>
                          <td className={cn(table.td, 'text-right font-medium tabular-nums text-foreground')}>{row.result.risk_score}</td>
                          <td className={cn(table.td, 'text-right tabular-nums text-muted-foreground')}>
                            {formatPercent(row.result.fraud_probability, 2)}
                          </td>
                          <td className={table.td}>
                            <DecisionLabel decision={parseAction(row.result.recommended_action).decision} />
                          </td>
                        </>
                      ) : (
                        <td colSpan={5} className={table.td}>
                          <Badge className="bg-danger/10 text-danger-fg ring-danger/20">Failed</Badge>
                          <span className="ml-2 text-muted-foreground">{row.error}</span>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={currentPage} pageCount={pageCount} total={rows.length} pageSize={PAGE_SIZE} onPageChange={setPage} />
          </Card>
        </>
      )}

      {!rows.length && !running && items.length > 0 && (
        <Callout title="Ready to score">
          Scored transactions are also added to Transactions and can raise alerts, just like single scores.
        </Callout>
      )}

      <Sheet
        open={!!selected?.result}
        onClose={() => setSelected(null)}
        title={selected ? `Row ${selected.index + 1}` : ''}
        description={<span className="font-mono text-xs">{selected?.result?.transaction_id}</span>}
      >
        {selected?.result && <TransactionDetail result={selected.result} input={selected.input} />}
      </Sheet>
    </div>
  )
}
