'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/** Escape to close, focus trap, scroll lock and focus restore for modal surfaces. */
export function useOverlay(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    panelRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onCloseRef.current()
        return
      }
      const panel = panelRef.current
      if (event.key !== 'Tab' || !panel) return
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflow
      previous?.focus()
    }
  }, [open])

  return panelRef
}

const scrim = 'absolute inset-0 animate-fade-in bg-foreground/25 dark:bg-black/60'

interface OverlayProps {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
}

export function Sheet({ open, onClose, title, description, children, footer }: OverlayProps) {
  const panelRef = useOverlay(open, onClose)
  const titleId = useId()
  if (!open) return null

  // Portal so parent layout utilities (e.g. space-y margins) can't offset the fixed overlay.
  return createPortal(
    <div className="fixed inset-0 z-50">
      <div className={scrim} onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl animate-slide-in-right flex-col border-l border-border bg-surface shadow-xl focus:outline-none"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-base font-semibold text-foreground">
              {title}
            </h2>
            {description && <div className="mt-0.5 truncate text-13 text-muted-foreground">{description}</div>}
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Close">
            <X />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}

export function Dialog({ open, onClose, title, description, children, footer }: OverlayProps) {
  const panelRef = useOverlay(open, onClose)
  const titleId = useId()
  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className={scrim} onClick={onClose} aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn('relative w-full max-w-md animate-scale-in rounded-xl border border-border bg-surface shadow-xl focus:outline-none')}
      >
        <div className="px-6 pt-6">
          <h2 id={titleId} className="text-base font-semibold text-foreground">
            {title}
          </h2>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="px-6 pt-4">{children}</div>}
        {footer && <div className="mt-6 flex justify-end gap-2 border-t border-border px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
