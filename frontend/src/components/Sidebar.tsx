'use client'

import { useTheme } from '@/contexts/ThemeContext'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const { theme, toggleTheme } = useTheme()

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 6v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'analyze', label: 'Analyze Stream', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'batch', label: 'Batch Processing', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'history', label: 'Transaction Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const reportItems = [
    { id: 'analytics', label: 'Deep Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { id: 'performance', label: 'Model Performance', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'alerts', label: 'Fraud Alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ]

  const settingItems = [
    { id: 'model-info', label: 'Model Artifacts', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'settings', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ]

  const NavItem = ({ item }: { item: any }) => (
    <button
      onClick={() => setActiveView(item.id)}
      className={`group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
        activeView === item.id
          ? 'text-white'
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      }`}
    >
      {activeView === item.id && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-100" />
      )}
      {activeView === item.id && (
        <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-purple-500 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
      )}
      <svg className={`w-5 h-5 relative z-10 flex-shrink-0 transition-colors ${activeView === item.id ? 'text-purple-400' : 'text-muted-foreground group-hover:text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeView === item.id ? 2 : 1.5} d={item.icon} />
      </svg>
      <span className="relative z-10 font-medium">{item.label}</span>
    </button>
  )

  return (
    <aside className="w-64 bg-card border-r border-border/50 flex flex-col h-screen sticky top-0 z-40 shrink-0">
      {/* Brand */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight gradient-text">
              FRAUDGUARD
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-muted-foreground">v3.0.0 ML API</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-4 space-y-8">
        <div>
          <p className="text-[11px] font-mono font-semibold text-muted-foreground/70 uppercase tracking-[0.2em] pl-4 mb-3">
            SYSTEM
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => <NavItem key={item.id} item={item} />)}
          </nav>
        </div>

        <div>
          <div className="flex items-center justify-between pr-4 mb-3">
            <p className="text-[11px] font-mono font-semibold text-muted-foreground/70 uppercase tracking-[0.2em] pl-4">
              INTELLIGENCE
            </p>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          </div>
          <nav className="space-y-1">
            {reportItems.map((item) => <NavItem key={item.id} item={item} />)}
          </nav>
        </div>
      </div>

      {/* Theme Toggle + Settings */}
      <div className="p-4 border-t border-border/50 mt-auto space-y-2">
        <button
          onClick={toggleTheme}
          className="group w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
        >
          <div className="w-5 h-5 flex items-center justify-center relative">
            {theme === 'dark' ? (
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </div>
          <span className="capitalize">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          <div className="ml-auto w-10 h-6 rounded-full bg-muted relative transition-colors">
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${theme === 'dark' ? 'left-1' : 'left-5'}`} />
          </div>
        </button>
        {settingItems.map((item) => <NavItem key={item.id} item={item} />)}
      </div>
    </aside>
  )
}
