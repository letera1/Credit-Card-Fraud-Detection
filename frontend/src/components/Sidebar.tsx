'use client'

import Link from 'next/link'
import { PanelLeftClose, PanelLeftOpen, ShieldCheck, X } from 'lucide-react'
import { Button } from '@/components/ui'
import { NAV_GROUPS, SETTINGS_ITEM, type NavItem } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export interface ApiState {
  status: 'connecting' | 'connected' | 'offline'
  version?: string
}

interface SidebarProps {
  activeId: string
  activeAlerts: number
  api: ApiState
  collapsed?: boolean
  onToggleCollapse?: () => void
  /** Present when rendered as the mobile drawer. */
  onClose?: () => void
}

function NavLink({
  item,
  active,
  collapsed,
  badge,
  onNavigate,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  badge?: number
  onNavigate?: () => void
}) {
  const Icon = item.icon
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? (badge ? `${item.label}, ${badge} active` : item.label) : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        'focus-ring group relative flex h-9 items-center gap-2.5 rounded-lg text-sm font-medium transition-colors',
        collapsed ? 'justify-center' : 'px-2.5',
        active ? 'bg-muted text-foreground' : 'text-muted-foreground hover:bg-hover hover:text-foreground',
      )}
    >
      <Icon
        className={cn('size-[18px] shrink-0', active ? 'text-foreground' : 'text-subtle-foreground group-hover:text-muted-foreground')}
        aria-hidden
      />
      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
      {!!badge && !collapsed && (
        <span className="rounded-full bg-danger/10 px-1.5 text-xs font-medium tabular-nums text-danger-fg ring-1 ring-inset ring-danger/20">
          {badge}
        </span>
      )}
      {!!badge && collapsed && <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-surface" aria-hidden />}
    </Link>
  )
}

export default function Sidebar({ activeId, activeAlerts, api, collapsed = false, onToggleCollapse, onClose }: SidebarProps) {
  const statusLabel =
    api.status === 'connected'
      ? `API connected${api.version ? ` · v${api.version}` : ''}`
      : api.status === 'offline'
        ? 'API unreachable'
        : 'Connecting to API…'

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
        collapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      <div className={cn('flex h-14 shrink-0 items-center gap-2.5 border-b border-border', collapsed ? 'justify-center' : 'px-4')}>
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
          <ShieldCheck className="size-[18px]" strokeWidth={2.25} aria-hidden />
        </div>
        {!collapsed && <span className="truncate text-[15px] font-semibold tracking-tight text-foreground">FraudShield</span>}
        {onClose && (
          <Button variant="ghost" size="icon-sm" className="ml-auto" onClick={onClose} aria-label="Close navigation">
            <X />
          </Button>
        )}
      </div>

      <nav aria-label="Main" className="flex-1 overflow-y-auto px-3 py-4">
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label} className={cn(index > 0 && (collapsed ? 'mt-2' : 'mt-6'))}>
            {collapsed ? (
              index > 0 && <div className="mx-2 mb-2 h-px bg-border" aria-hidden />
            ) : (
              <p className="mb-1.5 px-2.5 text-xs font-medium text-subtle-foreground">{group.label}</p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    item={item}
                    active={item.id === activeId}
                    collapsed={collapsed}
                    badge={item.id === 'alerts' ? activeAlerts : undefined}
                    onNavigate={onClose}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="space-y-0.5 border-t border-border px-3 py-3">
        <NavLink item={SETTINGS_ITEM} active={activeId === SETTINGS_ITEM.id} collapsed={collapsed} onNavigate={onClose} />
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className={cn(
              'focus-ring flex h-9 w-full items-center gap-2.5 rounded-lg text-sm font-medium text-muted-foreground transition-colors hover:bg-hover hover:text-foreground',
              collapsed ? 'justify-center' : 'px-2.5',
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="size-[18px] text-subtle-foreground" aria-hidden />
            ) : (
              <PanelLeftClose className="size-[18px] text-subtle-foreground" aria-hidden />
            )}
            {!collapsed && 'Collapse'}
          </button>
        )}
        <div
          role="status"
          title={statusLabel}
          className={cn('flex h-9 items-center gap-2.5 text-xs text-muted-foreground', collapsed ? 'justify-center' : 'px-2.5')}
        >
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              api.status === 'connected' ? 'bg-success' : api.status === 'offline' ? 'bg-danger' : 'bg-subtle-foreground',
            )}
            aria-hidden
          />
          <span className={cn('truncate', collapsed && 'sr-only')}>{statusLabel}</span>
        </div>
      </div>
    </aside>
  )
}
