'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const [notifications] = useState([
    { id: 1, type: 'critical', message: 'Model drift detected in V4 PCA feature', time: '2 min ago', read: false },
    { id: 2, type: 'warning', message: 'Inference latency spike (>100ms)', time: '15 min ago', read: false },
    { id: 3, type: 'info', message: 'Ensemble model retrained successfully', time: '1 hour ago', read: true },
  ])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch && searchQuery.trim()) onSearch(searchQuery)
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border/50 h-20 flex items-center px-4 md:px-8 justify-between shrink-0">
      {/* Breadcrumbs */}
      <div className="hidden lg:flex items-center space-x-2 text-sm font-mono text-muted-foreground">
        <span className="text-purple-500 font-medium">cluster.ml</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="text-foreground/80">fraud-detection</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="bg-primary/15 text-primary text-xs font-semibold px-2 py-0.5 rounded border border-primary/30">{'<'}/production{' >'}</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-4 md:mx-8">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative bg-muted/60 border border-border rounded-lg flex items-center px-4 py-2 hover:border-primary/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
            <svg className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search transactions by ID, user, or risk hash..."
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <div className="hidden sm:flex items-center space-x-1">
              <kbd className="text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5">⌘</kbd>
              <kbd className="text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5">K</kbd>
            </div>
          </div>
        </form>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3 md:space-x-5">

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-muted/60 transition-colors group"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-amber-600 group-hover:text-amber-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* API Health */}
        <div className="hidden sm:flex flex-col items-end">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-muted-foreground/80 uppercase tracking-wider">API</span>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            </div>
          </div>
          <span className="text-xs text-green-500 font-mono">14ms resp</span>
        </div>

        <div className="w-px h-8 bg-border/50 hidden sm:block" />

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-muted/60 transition-colors group"
          >
            <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-4 w-96 bg-card border border-border/60 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="p-4 border-b border-border/50 bg-muted/30 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">System Alerts</h3>
                <span className="text-[10px] font-mono bg-primary/10 px-2 py-1 rounded text-primary">{unreadCount} unread</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-border/50 hover:bg-muted/50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full shadow-[0_0_6px_currentColor] ${
                        notif.type === 'critical' ? 'bg-red-500 text-red-500' :
                        notif.type === 'warning' ? 'bg-orange-500 text-orange-500' : 'bg-blue-500 text-blue-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/90 leading-snug">{notif.message}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center cursor-pointer hover:shadow-xl hover:shadow-purple-500/30 transition-all">
          <span className="text-xs font-bold text-white">ML</span>
        </div>
      </div>
    </header>
  )
}
