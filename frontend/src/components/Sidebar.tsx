'use client'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { id: 'analyze', label: 'Analyze Stream', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
    { id: 'history', label: 'Transaction Logs', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  ]

  const reportItems = [
    { id: 'analytics', label: 'Deep Analytics', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
    { id: 'alerts', label: 'Fraud Alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ]

  const settingItems = [
    { id: 'model-info', label: 'Model Artifacts', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z' },
    { id: 'settings', label: 'Configuration', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
  ]

  const NavItem = ({ item }: { item: any }) => (
    <button
      onClick={() => setActiveView(item.id)}
      className={`group w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
        activeView === item.id
          ? 'text-white'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {activeView === item.id && (
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-100 transition-opacity"></div>
      )}
      {activeView === item.id && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-blue-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>
      )}
      
      <svg className={`w-5 h-5 relative z-10 transition-colors ${activeView === item.id ? 'text-purple-400' : 'text-slate-500 group-hover:text-purple-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeView === item.id ? 2 : 1.5} d={item.icon} />
        {item.id === 'settings' && activeView !== item.id && <circle cx="12" cy="12" r="3" />}
        {item.id === 'settings' && activeView === item.id && <circle cx="12" cy="12" r="3" className="fill-purple-500/50" />}
      </svg>
      <span className="relative z-10">{item.label}</span>
    </button>
  )

  return (
    <aside className="w-64 glass-panel border-y-0 border-l-0 border-r-white/5 flex flex-col h-screen sticky top-0 shadow-2xl z-40">
      {/* Brand area */}
      <div className="p-6 border-b border-white/5 bg-black/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              FRAUDGUARD
            </h1>
            <p className="text-[10px] uppercase font-mono tracking-widest text-slate-500">v3.0.0 ML API</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide py-6 px-4 space-y-8">
        {/* General Section */}
        <div>
          <p className="text-[11px] font-mono font-semibold text-slate-500 tracking-widest pl-4 mb-3">
            SYSTEM
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => <NavItem key={item.id} item={item} />)}
          </nav>
        </div>

        {/* Reports Section */}
        <div>
          <div className="flex items-center justify-between pr-4 mb-3">
            <p className="text-[11px] font-mono font-semibold text-slate-500 tracking-widest pl-4">
              INTELLIGENCE
            </p>
            {/* Mock live pulse */}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <nav className="space-y-1">
            {reportItems.map((item) => <NavItem key={item.id} item={item} />)}
          </nav>
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-4 border-t border-white/5 bg-black/20 mt-auto">
        <nav className="space-y-1">
          {settingItems.map((item) => <NavItem key={item.id} item={item} />)}
        </nav>
      </div>
    </aside>
  )
}
