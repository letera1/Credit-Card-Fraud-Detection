import {
  ArrowLeftRight,
  Bell,
  ChartColumn,
  Cpu,
  Gauge,
  Layers,
  LayoutDashboard,
  ScanSearch,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  description: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Monitoring',
    items: [
      { id: 'overview', label: 'Overview', href: '/overview', icon: LayoutDashboard, description: 'Scoring activity and open alerts' },
      { id: 'history', label: 'Transactions', href: '/history', icon: ArrowLeftRight, description: 'Every scored transaction' },
      { id: 'alerts', label: 'Alerts', href: '/alerts', icon: Bell, description: 'Fraud and high-risk alerts' },
      { id: 'analytics', label: 'Analytics', href: '/analytics', icon: ChartColumn, description: 'Distributions across scored transactions' },
    ],
  },
  {
    label: 'Scoring',
    items: [
      { id: 'analyze', label: 'Score transaction', href: '/analyze', icon: ScanSearch, description: 'Score a single transaction' },
      { id: 'batch', label: 'Batch scoring', href: '/batch', icon: Layers, description: 'Score a JSON file of transactions' },
    ],
  },
  {
    label: 'Model',
    items: [
      { id: 'performance', label: 'Performance', href: '/performance', icon: Gauge, description: 'Evaluation metrics and feature importance' },
      { id: 'model-info', label: 'Model details', href: '/model-info', icon: Cpu, description: 'Artifacts, rules and features' },
    ],
  },
]

export const SETTINGS_ITEM: NavItem = {
  id: 'settings',
  label: 'Settings',
  href: '/settings',
  icon: Settings,
  description: 'Appearance, API connection and runtime data',
}

/** Sidebar order; number keys 1–9 navigate in this order. */
export const ALL_NAV_ITEMS: NavItem[] = [...NAV_GROUPS.flatMap((group) => group.items), SETTINGS_ITEM]

export function findNavItem(pathname: string) {
  const segment = pathname.split('/').filter(Boolean)[0] ?? 'overview'
  return ALL_NAV_ITEMS.find((item) => item.id === segment)
}

export function findNavGroupLabel(itemId: string) {
  return NAV_GROUPS.find((group) => group.items.some((item) => item.id === itemId))?.label
}
