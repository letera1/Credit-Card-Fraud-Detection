'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (view: string) => void
}

interface CommandItem {
  id: string
  label: string
  description: string
  icon: string
  category: string
  action: () => void
}

export default function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const allCommands: CommandItem[] = [
    { id: 'overview', label: 'Overview', description: 'View system dashboard and metrics', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z', category: 'Navigation', action: () => { onNavigate('overview'); onClose() } },
    { id: 'analyze', label: 'Analyze Stream', description: 'Submit transaction for real-time fraud evaluation', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', category: 'Navigation', action: () => { onNavigate('analyze'); onClose() } },
    { id: 'batch', label: 'Batch Processing', description: 'Upload and process multiple transactions', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', category: 'Navigation', action: () => { onNavigate('batch'); onClose() } },
    { id: 'history', label: 'Transaction Logs', description: 'Browse and filter transaction history', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', category: 'Navigation', action: () => { onNavigate('history'); onClose() } },
    { id: 'analytics', label: 'Deep Analytics', description: 'View advanced fraud analytics and insights', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z', category: 'Intelligence', action: () => { onNavigate('analytics'); onClose() } },
    { id: 'performance', label: 'Model Performance', description: 'Review model metrics, ROC curves, and confusion matrix', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', category: 'Intelligence', action: () => { onNavigate('performance'); onClose() } },
    { id: 'alerts', label: 'Fraud Alerts', description: 'Manage and acknowledge fraud alerts', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', category: 'Intelligence', action: () => { onNavigate('alerts'); onClose() } },
    { id: 'model-info', label: 'Model Artifacts', description: 'View model versions, retrain pipeline', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', category: 'System', action: () => { onNavigate('model-info'); onClose() } },
    { id: 'settings', label: 'Configuration', description: 'Adjust system settings and preferences', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', category: 'System', action: () => { onNavigate('settings'); onClose() } },
    { id: 'theme', label: 'Toggle Theme', description: 'Switch between light and dark mode', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z', category: 'Actions', action: () => { document.dispatchEvent(new CustomEvent('toggle-theme')); onClose() } },
  ]

  const filtered = query.trim()
    ? allCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.description.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase())
      )
    : allCommands

  const groupedCommands = filtered.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const flatFiltered = Object.values(groupedCommands).flat()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.children[selectedIndex] as HTMLElement
    if (selected) {
      selected.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }
  }, [selectedIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % flatFiltered.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + flatFiltered.length) % flatFiltered.length)
          break
        case 'Enter':
          e.preventDefault()
          if (flatFiltered[selectedIndex]) {
            flatFiltered[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    },
    [flatFiltered, selectedIndex, onClose]
  )

  if (!isOpen) return null

  let runningIndex = -1

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg mx-4 bg-card/95 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-border/40">
          <svg className="w-5 h-5 text-muted-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, actions, and settings..."
            className="flex-1 bg-transparent px-3 py-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
          />
          <kbd className="text-[10px] text-muted-foreground/50 border border-border rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto scrollbar-hide py-2">
          {flatFiltered.length === 0 && (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">No results found for &quot;{query}&quot;</p>
            </div>
          )}

          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category}>
              <p className="px-4 py-1.5 text-[10px] font-mono font-semibold text-muted-foreground/50 uppercase tracking-wider">
                {category}
              </p>
              {items.map((cmd) => {
                runningIndex++
                const idx = runningIndex
                const isSelected = idx === selectedIndex
                return (
                  <button
                    key={cmd.id}
                    onClick={cmd.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
                      isSelected ? 'bg-muted/60' : 'hover:bg-muted/40'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected ? 'bg-purple-500/15 text-purple-400' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={cmd.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{cmd.label}</p>
                      <p className="text-xs text-muted-foreground/60 truncate">{cmd.description}</p>
                    </div>
                    {isSelected && (
                      <kbd className="text-[10px] text-muted-foreground/40 border border-border/60 rounded px-1.5 py-0.5 font-mono flex-shrink-0">
                        Enter
                      </kbd>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border/40 flex items-center gap-4 text-[10px] font-mono text-muted-foreground/40">
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1 py-0.5">↑↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1 py-0.5">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="border border-border/60 rounded px-1 py-0.5">esc</kbd>
            Close
          </span>
        </div>
      </div>
    </div>
  )
}
