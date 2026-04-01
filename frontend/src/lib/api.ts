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
