'use client'

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Monitor, Moon, Search, Sun, type LucideIcon } from 'lucide-react'
import { useOverlay } from '@/components/overlays'
import { Kbd } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { ALL_NAV_ITEMS } from '@/lib/navigation'
import { cn } from '@/lib/utils'

interface Command {
  id: string
  label: string
  hint?: string
  group: string
  icon: LucideIcon
  run: () => void
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { setPreference } = useTheme()
  const panelRef = useOverlay(true, onClose)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  // Runs after useOverlay focuses the panel, so the input ends up focused.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const commands = useMemo<Command[]>(
    () => [
      ...ALL_NAV_ITEMS.map((item) => ({
        id: item.id,
        label: item.label,
        hint: item.description,
        group: 'Pages',
        icon: item.icon,
        run: () => router.push(item.href),
      })),
      { id: 'theme-system', label: 'Use system theme', group: 'Appearance', icon: Monitor, run: () => setPreference('system') },
      { id: 'theme-light', label: 'Use light theme', group: 'Appearance', icon: Sun, run: () => setPreference('light') },
      { id: 'theme-dark', label: 'Use dark theme', group: 'Appearance', icon: Moon, run: () => setPreference('dark') },
    ],
    [router, setPreference],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((command) => `${command.label} ${command.hint ?? ''} ${command.group}`.toLowerCase().includes(q))
  }, [commands, query])

  const groups = useMemo(() => {
    const map = new Map<string, { command: Command; index: number }[]>()
    results.forEach((command, index) => map.set(command.group, [...(map.get(command.group) ?? []), { command, index }]))
    return [...map.entries()]
  }, [results])

  const run = (command: Command) => {
    onClose()
    command.run()
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!results.length) return
      const next = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length
      setActiveIndex(next)
      listRef.current?.querySelector(`[data-index="${next}"]`)?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Enter' && results[activeIndex]) {
      event.preventDefault()
      run(results[activeIndex])
    }
  }

  const activeCommand = results[activeIndex]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 animate-fade-in bg-foreground/25 dark:bg-black/60" onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        tabIndex={-1}
        className="relative w-full max-w-xl animate-scale-in overflow-hidden rounded-xl border border-border bg-surface shadow-xl focus:outline-none"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="size-4 shrink-0 text-subtle-foreground" aria-hidden />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onKeyDown}
            placeholder="Search pages and actions"
            role="combobox"
            aria-label="Search pages and actions"
            aria-expanded
            aria-controls="command-results"
            aria-activedescendant={activeCommand ? `command-${activeCommand.id}` : undefined}
            className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-subtle-foreground focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <ul ref={listRef} id="command-results" role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && (
            <li role="presentation" className="px-3 py-10 text-center text-13 text-muted-foreground">
              No results for “{query}”
            </li>
          )}
          {groups.map(([group, entries]) => (
            <li key={group} role="presentation">
              <p className="px-2.5 pb-1 pt-2 text-xs font-medium text-subtle-foreground">{group}</p>
              <ul role="presentation">
                {entries.map(({ command, index }) => {
                  const Icon = command.icon
                  const active = index === activeIndex
                  return (
                    <li
                      key={command.id}
                      id={`command-${command.id}`}
                      data-index={index}
                      role="option"
                      aria-selected={active}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => run(command)}
                      className={cn('flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2', active && 'bg-muted')}
                    >
                      <Icon className={cn('size-4 shrink-0', active ? 'text-foreground' : 'text-subtle-foreground')} aria-hidden />
                      <span className="shrink-0 text-sm text-foreground">{command.label}</span>
                      {command.hint && <span className="hidden truncate text-13 text-subtle-foreground sm:inline">{command.hint}</span>}
                      {active && <CornerDownLeft className="ml-auto size-3.5 shrink-0 text-subtle-foreground" aria-hidden />}
                    </li>
                  )
                })}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
