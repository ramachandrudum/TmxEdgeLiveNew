export type ThemeConfig = {
  id: string
  label: string
  primary: string
  accent: string
  background: string
  card: string
  dark: boolean
}

export const defaultTheme: ThemeConfig = {
  id: 'default',
  label: 'Default',
  primary: '#2563eb',
  accent: '#8b5cf6',
  background: '#f8fafc',
  card: '#ffffff',
  dark: false,
}

export const themePresets: ThemeConfig[] = [
  {
    id: 'light-modern',
    label: 'Light Modern',
    primary: '#3b82f6',
    accent: '#8b5cf6',
    background: '#f8fafc',
    card: '#ffffff',
    dark: false,
  },
  {
    id: 'dark-onyx',
    label: 'Dark Onyx',
    primary: '#38bdf8',
    accent: '#c084fc',
    background: '#090d16',
    card: '#131c2e',
    dark: true,
  },
  {
    id: 'sunset-ember',
    label: 'Sunset Ember',
    primary: '#f43f5e',
    accent: '#fb923c',
    background: '#1a0b18',
    card: '#281225',
    dark: true,
  },
  {
    id: 'cyberpunk-neon',
    label: 'Cyberpunk Neon',
    primary: '#00f5d4',
    accent: '#7b2cbf',
    background: '#0d0221',
    card: '#190838',
    dark: true,
  },
  {
    id: 'emerald-garden',
    label: 'Emerald Garden',
    primary: '#10b981',
    accent: '#14b8a6',
    background: '#f0fdf4',
    card: '#ffffff',
    dark: false,
  },
  {
    id: 'deep-sapphire',
    label: 'Deep Sapphire',
    primary: '#6366f1',
    accent: '#a855f7',
    background: '#0f172a',
    card: '#1e293b',
    dark: true,
  },
]
