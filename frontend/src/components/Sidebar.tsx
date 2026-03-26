'use client'

import { useState } from 'react'

interface SidebarProps {
  activeView: string
  setActiveView: (view: string) => void
}

export default function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'issues', label: 'Issues', icon: '⚠️', hasSubmenu: true },
    { id: 'files', label: 'Files', icon: '📁' },
  ]

  const reportItems = [
    { id: 'threat-details', label: 'Threat Details', icon: '🔍' },
    { id: 'threats', label: 'Threats', icon: '🛡️', hasSubmenu: true },
  ]

  const settingItems = [
    { id: 'help', label: 'Help & Supports', icon: '❓' },
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
              {item.hasSubmenu && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
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
              {item.hasSubmenu && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
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
              <span className="text-2xl">🐛</span>
            </div>
          </div>
          <p className="text-xs text-center text-foreground font-medium mb-2">
            Additional features to enhance your security.
          </p>
          <button className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all">
            Upgrade →
          </button>
        </div>

        {/* Logout */}
        <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all mt-4">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
