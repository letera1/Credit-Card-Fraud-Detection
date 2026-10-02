import axios from 'axios'
import type {
  AlertsResponse,
  Analytics,
  FeatureImportance,
  Health,
  ModelInfo,
  PredictionResult,
  TransactionInput,
  TransactionsResponse,
} from '@/types'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const client = axios.create({ baseURL: API_URL, timeout: 15000 })

/** Turns an axios error into a message suitable for display. */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return `${detail[0].loc?.slice(-1)[0] ?? 'Input'}: ${detail[0].msg}`
    if (!error.response) return `Can't reach the API at ${API_URL}.`
    return `Request failed with status ${error.response.status}.`
  }
  return error instanceof Error ? error.message : 'Something went wrong.'
}

export async function predictTransaction(data: TransactionInput, signal?: AbortSignal) {
  return (await client.post<PredictionResult>('/predict', data, { signal })).data
}

export async function getAnalytics() {
  return (await client.get<Analytics>('/analytics')).data
}

export async function getTransactions(limit = 500) {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 500))
  return (await client.get<TransactionsResponse>('/transactions', { params: { limit: safeLimit } })).data
}

export async function getAlerts() {
  return (await client.get<AlertsResponse>('/alerts')).data
}

export async function resolveAlert(alertId: string) {
  return (await client.post(`/alerts/${encodeURIComponent(alertId)}/resolve`)).data
}

export async function getHealth() {
  return (await client.get<Health>('/health')).data
}

export async function getModelInfo() {
  return (await client.get<ModelInfo>('/model/info')).data
}

export async function getFeatureImportance() {
  const res = await client.get<{ feature_importance: FeatureImportance[] }>('/model/feature-importance')
  return res.data.feature_importance
}

export async function resetRuntimeData() {
  return (await client.delete<{ message: string }>('/reset')).data
}
