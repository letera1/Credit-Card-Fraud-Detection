'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '@/lib/api'

/** Fetches on mount and every `intervalMs` while the tab is visible. */
export function usePolling<T>(fetcher: () => Promise<T>, intervalMs = 10000) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const fetcherRef = useRef(fetcher)

  useEffect(() => {
    fetcherRef.current = fetcher
  }, [fetcher])

  const refresh = useCallback(async () => {
    try {
      const result = await fetcherRef.current()
      setData(result)
      setError(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
    if (!intervalMs) return
    const tick = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    const id = window.setInterval(tick, intervalMs)
    document.addEventListener('visibilitychange', tick)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [refresh, intervalMs])

  return { data, error, loading, refresh, setData }
}

/** "⌘" on Apple platforms, "Ctrl" elsewhere; resolved after mount to avoid hydration mismatches. */
export function useModifierKey() {
  const [key, setKey] = useState('Ctrl')
  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)) setKey('⌘')
  }, [])
  return key
}

export const ALERTS_CHANGED_EVENT = 'fraudshield:alerts-changed'
