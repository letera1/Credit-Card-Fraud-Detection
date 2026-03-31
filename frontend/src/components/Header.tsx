'use client'

import { useState } from 'react'

interface HeaderProps {
  onSearch?: (query: string) => void
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  
  // Mock ML alerts
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
    <header className="sticky top-0 z-30 w-full glass-panel border-x-0 border-t-0 border-b-white/5 h-20 flex items-center px-8 justify-between backdrop-blur-3xl bg-card/40">
      
      {/* Dynamic Breadcrumbs / Current Scope */}
      <div className="hidden lg:flex items-center space-x-2 text-sm font-mono text-slate-400">
        <span className="text-purple-400">cluster.ml</span>
        <span className="text-slate-600">/</span>
        <span className="text-slate-300">fraud-detection</span>
        <span className="text-slate-600">/</span>
        <span className="text-white bg-white/10 px-2 py-0.5 rounded text-xs border border-white/10">production</span>
      </div>

      {/* Center - Global Search */}
      <div className="flex-1 max-w-xl mx-8">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-black/40 border border-white/10 rounded-lg flex items-center px-4 py-2 hover:border-white/20 transition-colors">
            <svg className="w-4 h-4 text-slate-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Query transactions by ID, User, or Risk Hash..."
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none font-mono tracking-wide"
            />
            {/* Command shortcut hint */}
            <div className="hidden sm:flex items-center space-x-1">
              <span className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">⌘</span>
              <span className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5">K</span>
            </div>
          </div>
        </form>
      </div>

      {/* Right Side - Metrics & Profile */}
      <div className="flex items-center space-x-6">
        
        {/* API Health Pill */}
        <div className="hidden sm:flex flex-col items-end justify-center">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Inference API</span>
            <div className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
            </div>
          </div>
          <span className="text-xs text-green-400 font-mono">14ms resp</span>
        </div>

        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
          >
            <svg className="w-5 h-5 text-slate-300 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background shadow-[0_0_8px_rgba(239,68,68,0.8)]"></span>
            )}
          </button>

          {/* Alert Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-4 w-96 glass-panel rounded-xl shadow-2xl z-50 overflow-hidden border border-white/10">
              <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white tracking-wide">System Alerts</h3>
                <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-slate-300">{unreadCount} unread</span>
              </div>
              <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-purple-500/5' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full shadow-[0_0_8px_currentColor] ${
                        notif.type === 'critical' ? 'bg-red-500 text-red-500' :
                        notif.type === 'warning' ? 'bg-orange-500 text-orange-500' : 'bg-blue-500 text-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm text-slate-200 leading-snug">{notif.message}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-1.5">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Hook */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 border-2 border-white/20 flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
          <span className="text-xs font-bold text-white tracking-wider">ML</span>
        </div>
        
      </div>
    </header>
  )
}
