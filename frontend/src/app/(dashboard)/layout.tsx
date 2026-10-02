'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import CommandPalette from '@/components/CommandPalette'
import Header from '@/components/Header'
import Sidebar, { type ApiState } from '@/components/Sidebar'
import { getAlerts, getHealth } from '@/lib/api'
import { ALERTS_CHANGED_EVENT, usePolling } from '@/lib/hooks'
import { ALL_NAV_ITEMS, findNavItem } from '@/lib/navigation'

const COLLAPSED_KEY = 'sidebar-collapsed'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const activeItem = findNavItem(pathname)

  const [collapsed, setCollapsed] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const alerts = usePolling(getAlerts, 15000)
  const health = usePolling(getHealth, 30000)
  const refreshAlerts = alerts.refresh

  const api: ApiState = health.error
    ? { status: 'offline' }
    : health.data
      ? { status: 'connected', version: health.data.version }
      : { status: 'connecting' }

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1')
  }, [])

  useEffect(() => {
    setMobileNavOpen(false)
  }, [pathname])

  useEffect(() => {
    window.addEventListener(ALERTS_CHANGED_EVENT, refreshAlerts)
    return () => window.removeEventListener(ALERTS_CHANGED_EVENT, refreshAlerts)
  }, [refreshAlerts])

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      localStorage.setItem(COLLAPSED_KEY, current ? '0' : '1')
      return !current
    })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const modifier = event.metaKey || event.ctrlKey
      const key = event.key.toLowerCase()
      if (modifier && key === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
        return
      }
      if (modifier && key === 'b') {
        event.preventDefault()
        toggleCollapsed()
        return
      }
      if (modifier || event.altKey || event.shiftKey) return
      const target = event.target as HTMLElement | null
      if (target?.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return
      const index = Number(event.key) - 1
      if (Number.isInteger(index) && index >= 0 && index < ALL_NAV_ITEMS.length) {
        event.preventDefault()
        router.push(ALL_NAV_ITEMS[index].href)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, toggleCollapsed])

  const activeId = activeItem?.id ?? ''
  const activeAlerts = alerts.data?.active ?? 0

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-surface focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>

      <div className="hidden lg:flex">
        <Sidebar activeId={activeId} activeAlerts={activeAlerts} api={api} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </div>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-foreground/25 dark:bg-black/60" onClick={() => setMobileNavOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 animate-slide-in-left shadow-xl">
            <Sidebar activeId={activeId} activeAlerts={activeAlerts} api={api} onClose={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          activeItem={activeItem}
          onOpenCommandPalette={() => setPaletteOpen(true)}
          onOpenNavigation={() => setMobileNavOpen(true)}
        />
        <main id="main" className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1360px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
    </div>
  )
}
