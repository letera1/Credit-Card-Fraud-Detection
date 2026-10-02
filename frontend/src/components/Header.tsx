'use client'

import { ChevronRight, Menu, Moon, Search, Sun } from 'lucide-react'
import { Button, Kbd } from '@/components/ui'
import { useTheme } from '@/contexts/ThemeContext'
import { useModifierKey } from '@/lib/hooks'
import { findNavGroupLabel, type NavItem } from '@/lib/navigation'

interface HeaderProps {
  activeItem?: NavItem
  onOpenCommandPalette: () => void
  onOpenNavigation: () => void
}

export default function Header({ activeItem, onOpenCommandPalette, onOpenNavigation }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const modifier = useModifierKey()
  const group = activeItem ? findNavGroupLabel(activeItem.id) : undefined
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" onClick={onOpenNavigation} aria-label="Open navigation">
        <Menu />
      </Button>

      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex items-center gap-1.5 text-sm">
          {group && (
            <li className="hidden items-center gap-1.5 text-muted-foreground sm:flex">
              {group}
              <ChevronRight className="size-3.5 text-subtle-foreground" aria-hidden />
            </li>
          )}
          <li className="truncate font-medium text-foreground" aria-current="page">
            {activeItem?.label ?? 'FraudShield'}
          </li>
        </ol>
      </nav>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Search pages and actions"
          className="focus-ring hidden h-9 w-60 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 text-sm text-subtle-foreground shadow-xs transition-colors hover:bg-hover md:flex"
        >
          <Search className="size-4 shrink-0" aria-hidden />
          <span className="flex-1 truncate text-left">Search…</span>
          <span className="flex items-center gap-0.5">
            <Kbd>{modifier}</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onOpenCommandPalette} aria-label="Search pages and actions">
          <Search />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
        >
          {resolvedTheme === 'dark' ? <Sun /> : <Moon />}
        </Button>
      </div>
    </header>
  )
}
