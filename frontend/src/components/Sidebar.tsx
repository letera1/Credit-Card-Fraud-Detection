'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'
import { getAlerts } from '@/lib/api'

interface SidebarProps {
  activeView: string
  collapsed?: boolean
  onToggleCollapse?: () => void
}

interface NavItemData {
  id: string
  label: string
  href: string
  icon: string
  badge?: number
}

const systemItems: NavItemData[] = [
  { id: 'overview', label: 'Overview', href: '/overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { id: 'analyze', label: 'Analyze Stream', href: '/analyze', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { id: 'batch', label: 'Batch Processing', href: '/batch', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { id: 'history', label: 'Transaction Logs', href: '/history', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
]

const intelItems: NavItemData[] = [
  { id: 'analytics', label: 'Deep Analytics', href: '/analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { id: 'performance', label: 'Model Performance', href: '/performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id: 'alerts', label: 'Fraud Alerts', href: '/alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
]

const configItems: NavItemData[] = [
  { id: 'model-info', label: 'Model Artifacts', href: '/model-info', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
  { id: 'settings', label: 'Configuration', href: '/settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
]

function NavLink({
  item,
  activeView,
  collapsed,
  hoveredItem,
  tooltipPos,
  onHover,
  onLeave,
}: {
  item: NavItemData
  activeView: string
  collapsed: boolean
  hoveredItem: string | null
  tooltipPos: { top: number; left: number }
  onHover: (e: React.MouseEvent, itemId: string) => void
  onLeave: () => void
}) {
  const isActive = activeView === item.id
  const hasBadge = item.badge && item.badge > 0

  return (
    <div className="relative">
      <Link
        href={item.href}
        onMouseEnter={(e) => onHover(e, item.id)}
        onMouseLeave={onLeave}
        className={`group w-full flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden ${
          collapsed ? 'px-0 py-2.5 justify-center mx-2' : 'px-3 py-2.5'
        } ${
          isActive
            ? 'text-white'
            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }`}
        title={collapsed ? item.label : undefined}
      >
        {isActive && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl" />
            <div className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-purple-500 to-blue-500 shadow-[0_0_12px_rgba(168,85,247,0.5)]" />
          </>
        )}

        <div className={`relative z-10 flex items-center justify-center ${collapsed ? '' : 'w-5 h-5'}`}>
          <svg
            className={`w-5 h-5 flex-shrink-0 transition-colors duration-200 ${
              isActive ? 'text-purple-400' : 'text-muted-foreground group-hover:text-purple-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={isActive ? 2 : 1.5}
              d={item.icon}
            />
          </svg>
        </div>

        {!collapsed && (
          <span className="relative z-10 flex-1 text-left truncate">{item.label}</span>
        )}

        {!collapsed && hasBadge && (
          <span className="relative z-10 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-bold text-red-400 font-mono">
            {item.badge}
          </span>
        )}
      </Link>

      {collapsed && hoveredItem === item.id && (
        <div
          className="fixed z-[100] px-3 py-2 rounded-lg bg-card/95 backdrop-blur-xl border border-border/60 shadow-2xl text-sm font-medium text-foreground whitespace-nowrap pointer-events-none animate-in fade-in duration-150"
          style={{ top: tooltipPos.top, left: tooltipPos.left, transform: 'translateY(-50%)' }}
        >
          {item.label}
          {hasBadge && (
            <span className="ml-2 text-[10px] font-mono text-red-400">{item.badge} alerts</span>
          )}
        </div>
      )}
    </div>
  )
}

export default function Sidebar({ activeView, collapsed = false, onToggleCollapse }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })
  const [activeAlertCount, setActiveAlertCount] = useState(0)

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const res = await getAlerts()
        setActiveAlertCount(res?.active ?? 0)
      } catch {}
    }
    fetchAlertCount()
    const interval = setInterval(fetchAlertCount, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleNavHover = (e: React.MouseEvent, itemId: string) => {
    if (!collapsed) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setTooltipPos({ top: rect.top + rect.height / 2, left: rect.right + 12 })
    setHoveredItem(itemId)
  }

  const SectionLabel = ({ label, count, showDot = false }: { label: string; count?: number; showDot?: boolean }) => {
    if (collapsed) return null
    return (
      <div className="flex items-center justify-between px-3 mb-2">
        <p className="text-[10px] font-mono font-semibold text-muted-foreground/60 uppercase tracking-[0.15em]">
          {label}
        </p>
        <div className="flex items-center gap-2">
          {count !== undefined && count > 0 && (
            <span className="text-[10px] font-mono text-muted-foreground/50">{count}</span>
          )}
          {showDot && (
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
          )}
        </div>
      </div>
    )
  }

  return (
    <aside
      className={`flex flex-col h-screen sticky top-0 z-40 shrink-0 bg-card/50 backdrop-blur-xl border-r border-border/40 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className={`border-b border-border/40 transition-all duration-300 ${collapsed ? 'p-3' : 'p-5'}`}>
        <Link href="/overview" className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold font-mono tracking-tight gradient-text leading-none">
                FRAUDGUARD
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] uppercase font-mono tracking-wider text-muted-foreground/60">v3.0.0</span>
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-green-500/10 text-green-500 border border-green-500/20">LIVE</span>
              </div>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2 space-y-6">
        <div>
          <SectionLabel label="SYSTEM" count={systemItems.length} />
          <nav className="space-y-0.5">
            {systemItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                activeView={activeView}
                collapsed={collapsed}
                hoveredItem={hoveredItem}
                tooltipPos={tooltipPos}
                onHover={handleNavHover}
                onLeave={() => setHoveredItem(null)}
              />
            ))}
          </nav>
        </div>

        <div>
          <SectionLabel label="INTELLIGENCE" count={intelItems.length} showDot />
          <nav className="space-y-0.5">
            {intelItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                activeView={activeView}
                collapsed={collapsed}
                hoveredItem={hoveredItem}
                tooltipPos={tooltipPos}
                onHover={handleNavHover}
                onLeave={() => setHoveredItem(null)}
              />
            ))}
          </nav>
        </div>

        {!collapsed && <div className="mx-3 border-t border-border/40" />}

        <div>
          <SectionLabel label="CONFIGURATION" count={configItems.length} />
          <nav className="space-y-0.5">
            {configItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                activeView={activeView}
                collapsed={collapsed}
                hoveredItem={hoveredItem}
                tooltipPos={tooltipPos}
                onHover={handleNavHover}
                onLeave={() => setHoveredItem(null)}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Bottom */}
      <div className={`border-t border-border/40 transition-all duration-300 ${collapsed ? 'p-2' : 'p-3'}`}>
        <button
          onClick={toggleTheme}
          onMouseEnter={(e) => handleNavHover(e, 'theme')}
          onMouseLeave={() => setHoveredItem(null)}
          className={`group w-full flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ${
            collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2.5'
          }`}
        >
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            {theme === 'dark' ? (
              <svg className="w-[18px] h-[18px] text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-[18px] h-[18px] text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </div>
          {!collapsed && <span className="flex-1 text-left text-[13px]">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`group w-full flex items-center gap-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 ${
              collapsed ? 'px-0 py-2.5 justify-center mt-1' : 'px-3 py-2.5 mt-1'
            }`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <svg className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </div>
            {!collapsed && <span className="flex-1 text-left text-[13px]">Collapse</span>}
          </button>
        )}

        {!collapsed && (
          <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20">
                <span className="text-xs font-bold text-white">ML</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">ML Engineer</p>
                <p className="text-[10px] font-mono text-muted-foreground/60 truncate">admin@cluster.ml</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] flex-shrink-0" />
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mt-2 flex justify-center">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/20 relative">
              <span className="text-xs font-bold text-white">ML</span>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-card" />
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
