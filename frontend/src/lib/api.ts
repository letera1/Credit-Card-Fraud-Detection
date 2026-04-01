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
  const response = await apiClient.get('/transactions', { params: { limit } })
  return response.data
}
