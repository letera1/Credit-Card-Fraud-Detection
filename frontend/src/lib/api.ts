const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function getAnalytics() {
  const response = await fetch(`${API_URL}/analytics`)
  if (!response.ok) {
    throw new Error(`Failed to fetch analytics: ${response.statusText}`)
  }
  return response.json()
}

export async function getTransactions(limit: number = 10) {
  const response = await fetch(`${API_URL}/transactions?limit=${limit}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.statusText}`)
  }
  return response.json()
}
