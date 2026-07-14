'use client'

import { useState, useEffect, useRef } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  activeView: string
  onOpenCommandPalette?: () => void
}

export default function Header({ activeView, onOpenCommandPalette }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [apiLatency, setApiLatency] = useState(14)
  const [apiStatus, setApiStatus] = useState<'healthy' | 'degraded' | 'down'>('healthy')
  const notifRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  const [notifications, setNotifications] = useState([
    { id: 1, type: 'critical' as const, message: 'Model drift detected in V4 PCA features', time: '2 min ago', read: false },
    { id: 2, type: 'warning' as const, message: 'Inference latency spike (>100ms threshold)', time: '15 min ago', read: false },
    { id: 3, type: 'info' as const, message: 'Ensemble model retrained successfully', time: '1 hour ago', read: true },
    { id: 4, type: 'info' as const, message: 'Daily batch processing completed (1,247 txns)', time: '3 hours ago', read: true },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const viewLabels: Record<string, { title: string; subtitle: string }> = {
    overview: { title: 'System Overview', subtitle: 'Real-time monitoring dashboard' },
    analyze: { title: 'Analyze Stream', subtitle: 'Transaction fraud analysis' },
    batch: { title: 'Batch Processing', subtitle: 'Bulk transaction processing' },
    history: { title: 'Transaction Logs', subtitle: 'Historical transaction data' },
    analytics: { title: 'Deep Analytics', subtitle: 'Advanced fraud intelligence' },
    performance: { title: 'Model Performance', subtitle: 'Metrics and evaluation' },
    alerts: { title: 'Fraud Alerts', subtitle: 'Active threat notifications' },
    'model-info': { title: 'Model Artifacts', subtitle: 'Model registry and versions' },
    settings: { title: 'Configuration', subtitle: 'System preferences' },
  }

  const currentView = viewLabels[activeView] || { title: 'Dashboard', subtitle: '' }

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulated API latency
  useEffect(() => {
    const timer = setInterval(() => {
      const latency = Math.floor(Math.random() * 20) + 8
      setApiLatency(latency)
      setApiStatus(latency < 30 ? 'healthy' : latency < 80 ? 'degraded' : 'down')
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Click outside handlers
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const dismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  }

  return (
    <header className="sticky top-0 z-30 w-full bg-card/60 backdrop-blur-xl border-b border-border/30 h-14 flex items-center px-4 md:px-6 justify-between shrink-0">
      {/* Left: View Title + Breadcrumb */}
      <div className="flex items-center gap-4 min-w-0">
        <div className="hidden md:flex items-center gap-2 text-xs font-mono text-muted-foreground/50">
          <span className="text-purple-400/70">cluster.ml</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-foreground/50">fraud-detection</span>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-foreground/70">{activeView}</span>
        </div>

        <div className="hidden lg:block w-px h-5 bg-border/40" />

        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-foreground leading-none">{currentView.title}</p>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">{currentView.subtitle}</p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-4 md:mx-8">
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-2 bg-muted/40 border border-border/40 rounded-lg px-3 py-1.5 text-sm text-muted-foreground/50 hover:bg-muted/60 hover:border-border/60 transition-all duration-200 cursor-text group"
        >
          <svg className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="flex-1 text-left text-xs">Search...</span>
          <div className="hidden sm:flex items-center gap-0.5">
            <kbd className="text-[10px] font-mono text-muted-foreground/30 border border-border/40 rounded px-1 py-0.5 bg-muted/30">⌘</kbd>
            <kbd className="text-[10px] font-mono text-muted-foreground/30 border border-border/40 rounded px-1 py-0.5 bg-muted/30">K</kbd>
          </div>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 md:gap-2">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 mr-2">
          <div className="text-right">
            <p className="text-[11px] font-mono font-medium text-foreground/80 leading-none">{formatTime(currentTime)}</p>
            <p className="text-[9px] font-mono text-muted-foreground/40 mt-0.5">{formatDate(currentTime)}</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-5 bg-border/30" />

        {/* API Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-muted/40 transition-colors cursor-default">
          <div className="flex h-1.5 w-1.5 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              apiStatus === 'healthy' ? 'bg-green-400' : apiStatus === 'degraded' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 shadow-[0_0_6px_currentColor] ${
              apiStatus === 'healthy' ? 'bg-green-500 text-green-500' : apiStatus === 'degraded' ? 'bg-yellow-500 text-yellow-500' : 'bg-red-500 text-red-500'
            }`} />
          </div>
          <span className="text-[10px] font-mono text-muted-foreground/60">{apiLatency}ms</span>
        </div>

        <div className="hidden sm:block w-px h-5 bg-border/30" />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-4 h-4 text-yellow-400/80 group-hover:text-yellow-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false) }}
            className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <svg className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 flex items-center justify-center px-1 bg-red-500 rounded-full text-[9px] font-bold text-white font-mono border border-card shadow-[0_0_8px_rgba(239,68,68,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-card/95 backdrop-blur-2xl border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-down duration-200">
              <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-mono bg-red-500/10 px-1.5 py-0.5 rounded text-red-400 border border-red-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[360px] overflow-y-auto scrollbar-hide">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <svg className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <p className="text-xs text-muted-foreground/50">No notifications</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`group px-4 py-3 border-b border-border/30 hover:bg-muted/40 transition-colors cursor-pointer relative ${
                        !notif.read ? 'bg-purple-500/[0.03]' : ''
                      }`}
                    >
                      {!notif.read && (
                        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-500" />
                      )}
                      <div className="flex items-start gap-3 pl-2">
                        <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full shadow-[0_0_6px_currentColor] ${
                          notif.type === 'critical' ? 'bg-red-500 text-red-500' :
                          notif.type === 'warning' ? 'bg-orange-500 text-orange-500' : 'bg-blue-500 text-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-foreground/90 leading-relaxed">{notif.message}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] font-mono text-muted-foreground/40">{notif.time}</p>
                            <span className={`text-[9px] font-mono px-1 py-0.5 rounded ${
                              notif.type === 'critical' ? 'bg-red-500/10 text-red-400' :
                              notif.type === 'warning' ? 'bg-orange-500/10 text-orange-400' : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {notif.type}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); dismissNotification(notif.id) }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted/60 transition-all flex-shrink-0"
                        >
                          <svg className="w-3 h-3 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-border/30">
                <button className="w-full text-center text-[11px] font-medium text-purple-400 hover:text-purple-300 transition-colors py-1">
                  View all alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false) }}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-muted/50 transition-colors group"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-md shadow-purple-500/15 group-hover:shadow-purple-500/25 transition-shadow">
              <span className="text-[10px] font-bold text-white">ML</span>
            </div>
            <svg className="w-3 h-3 text-muted-foreground/50 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-card/95 backdrop-blur-2xl border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-down duration-200">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-border/40">
                <p className="text-sm font-semibold text-foreground">ML Engineer</p>
                <p className="text-[11px] font-mono text-muted-foreground/50">admin@cluster.ml</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-green-500/80">Online</span>
                  <span className="text-[10px] text-muted-foreground/30 mx-1">·</span>
                  <span className="text-[10px] font-mono text-muted-foreground/40">Admin</span>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                {[
                  { label: 'Profile Settings', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
                  { label: 'API Keys', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
                  { label: 'Documentation', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                  { label: 'Keyboard Shortcuts', icon: 'M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z', shortcut: '⌘/' },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                    </svg>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.shortcut && (
                      <kbd className="text-[10px] font-mono text-muted-foreground/30 border border-border/40 rounded px-1 py-0.5">{item.shortcut}</kbd>
                    )}
                  </button>
                ))}
              </div>

              {/* Separator */}
              <div className="border-t border-border/40 py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="flex-1 text-left">Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
