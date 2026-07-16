'use client'

import { useState, useEffect, useCallback, lazy, Suspense } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { useTheme } from '@/contexts/ThemeContext'

const CommandPalette = lazy(() => import('@/components/CommandPalette'))

const viewFromPath = (pathname: string) => {
  const seg = pathname.split('/').filter(Boolean)[0] || 'overview'
  return seg
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activeView = viewFromPath(pathname)
  const { toggleTheme } = useTheme()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    const handler = () => toggleTheme()
    document.addEventListener('toggle-theme', handler)
    return () => document.removeEventListener('toggle-theme', handler)
  }, [toggleTheme])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey

      if (isMeta && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        return
      }

      if (isMeta && e.key === 'b') {
        e.preventDefault()
        setSidebarCollapsed((prev) => !prev)
        return
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      const navKeys: Record<string, string> = {
        '1': 'overview', '2': 'analyze', '3': 'batch', '4': 'history',
        '5': 'analytics', '6': 'performance', '7': 'alerts', '8': 'model-info', '9': 'settings',
      }
      if (navKeys[e.key] && !isMeta && !e.altKey && !e.shiftKey) {
        e.preventDefault()
        window.location.href = `/${navKeys[e.key]}`
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background flex overflow-hidden text-foreground selection:bg-purple-500/30">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="hidden lg:block">
        <Sidebar
          activeView={activeView}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <div className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          activeView={activeView}
          collapsed={false}
          onToggleCollapse={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-h-screen relative">
        <Header
          activeView={activeView}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-purple-500/[0.03] rounded-full blur-[150px] pointer-events-none -z-10" />
        <div className="fixed top-1/4 right-1/4 w-[600px] h-[600px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none -z-10" />

        <main className="flex-1 overflow-y-auto scrollbar-hide z-0">
          <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto">
            {children}
          </div>

          <div className="border-t border-border/30 bg-card/30 backdrop-blur-sm px-4 md:px-6 py-2 flex items-center justify-between text-[10px] font-mono text-muted-foreground/40">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                System Online
              </span>
              <span>Model: XGBoost v3.0.0</span>
              <span className="hidden sm:inline">Threshold: 0.5</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline">Keys: 1-9 nav · ⌘K search · ⌘B sidebar</span>
              <span>FRAUDGUARD v3.0.0</span>
            </div>
          </div>
        </main>
      </div>

      <Suspense fallback={null}>
        {commandPaletteOpen && (
          <CommandPalette
            isOpen={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
          />
        )}
      </Suspense>
    </div>
  )
}
