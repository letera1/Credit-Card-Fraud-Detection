'use client'

import { useState } from 'react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'analyze', label: 'Analyze Transaction', icon: '🔍' },
    { id: 'history', label: 'Transaction History', icon: '📜' },
  ]

  const reportItems = [
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📈' },
    { id: 'alerts', label: 'Fraud Alerts', icon: '🚨' },
  ]

  const settingItems = [
    { id: 'model-info', label: 'Model Information', icon: '🤖' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      {/* General Section */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          General
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Reports Section */}
      <div className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Reports
        </p>
        <nav className="space-y-1">
          {reportItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeView === item.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/50'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Section */}
      <div className="p-4 mt-auto">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Settings
        </p>
        <nav className="space-y-1">
          {settingItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Upgrade Card */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-2xl">🛡️</span>
            </div>
          </div>
          <p className="text-xs text-center text-foreground font-medium mb-2">
            Upgrade to Enterprise for advanced fraud detection features.
          </p>
          <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Upgrade →
          </button>
        </div>
      </div>
    </aside>
  )
}
