import type { Config } from 'tailwindcss'

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: token('background'),
        surface: token('surface'),
        muted: token('muted'),
        hover: token('hover'),
        foreground: token('foreground'),
        'muted-foreground': token('muted-foreground'),
        'subtle-foreground': token('subtle-foreground'),
        border: token('border'),
        'border-strong': token('border-strong'),
        primary: {
          DEFAULT: token('primary'),
          hover: token('primary-hover'),
          foreground: token('primary-foreground'),
        },
        accent: token('accent'),
        ring: token('ring'),
        success: { DEFAULT: token('success'), fg: token('success-fg') },
        warning: { DEFAULT: token('warning'), fg: token('warning-fg') },
        orange: { DEFAULT: token('orange'), fg: token('orange-fg') },
        danger: { DEFAULT: token('danger'), fg: token('danger-fg') },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '13': ['0.8125rem', { lineHeight: '1.25rem' }],
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(16 24 40 / 0.05)',
        sm: '0 1px 3px 0 rgb(16 24 40 / 0.08), 0 1px 2px -1px rgb(16 24 40 / 0.06)',
        lg: '0 12px 16px -4px rgb(16 24 40 / 0.08), 0 4px 6px -2px rgb(16 24 40 / 0.03)',
        xl: '0 20px 24px -4px rgb(16 24 40 / 0.1), 0 8px 8px -4px rgb(16 24 40 / 0.04)',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'slide-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.97)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in-right': 'slide-in-right 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        'slide-in-left': 'slide-in-left 200ms cubic-bezier(0.32, 0.72, 0, 1)',
        'scale-in': 'scale-in 150ms ease-out',
      },
    },
  },
  plugins: [],
}

export default config
