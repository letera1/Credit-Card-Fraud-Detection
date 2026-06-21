import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const apiClient = axios.create({
  baseURL: API_URL,
})

export async function getAnalytics() {
  const response = await apiClient.get('/analytics')
  return response.data
}

export async function getTransactions(limit: number = 50) {
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 500))
  const response = await apiClient.get('/transactions', { params: { limit: safeLimit } })
  return response.data
}

export async function getAlerts() {
  const response = await apiClient.get('/alerts')
  return response.data
}

export async function resolveAlert(alertId: string) {
  const response = await apiClient.post(`/alerts/${alertId}/resolve`)
  return response.data
}

export async function getApiMetrics() {
  const response = await apiClient.get('/api-metrics')
  return response.data
}

export async function getModelComparison() {
  const response = await apiClient.get('/model-comparison')
  return response.data
}

export async function getDataDrift() {
  const response = await apiClient.get('/data-drift')
  return response.data
}

export async function getFeatureImportance() {
  const response = await apiClient.get('/feature-importance')
  return response.data
}

export async function getModelInfo() {
  const response = await apiClient.get('/model/info')
  return response.data
}

export async function getHealth() {
  const response = await apiClient.get('/health')
  return response.data
}
