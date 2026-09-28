import {
  ArrowLeft,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Cpu,
  Lock,
  Mail,
  MapPin,
  Moon,
  Palette,
  ShieldCheck,
  Sun,
  UserRound,
  X,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useState, type ChangeEvent } from 'react'
import type { Customer } from '../data/dashboard'
import type { Persona } from '../data/personas'
import { defaultTheme, themePresets, type ThemeConfig } from '../data/themes'

type CustomColors = Pick<ThemeConfig, 'primary' | 'accent' | 'background' | 'card'>

const toColors = (value: ThemeConfig | null): CustomColors => {
  const source = value ?? defaultTheme
  return {
    primary: source.primary,
    accent: source.accent,
    background: source.background,
    card: source.card,
  }
}

type AccessDetail = {
  label: string
  value: string
  Icon: LucideIcon
}

type Props = {
  open: boolean
  onClose: () => void
  dark: boolean
  theme: ThemeConfig | null
  profileImage?: string
  persona: Persona
  customer?: Customer | null
  activeBU: string
  dashboardSite: string
  selectedUnitPath: string[]
  onToggleDark: () => void
  onThemeChange: (theme: ThemeConfig) => void
  onResetTheme: () => void
  onProfileImageChange: (image: string | undefined) => void
}

const colorFields: { key: keyof CustomColors; label: string }[] = [
  { key: 'primary', label: 'Primary Color' },
  { key: 'accent', label: 'Accent Color' },
  { key: 'background', label: 'Background Color' },
  { key: 'card', label: 'Card Background' },
]

function getRoleLabel(persona: Persona) {
  if (persona.type === 'external') {
    return persona.view === 'operator' ? 'External operator' : 'External management user'
  }
  if (persona.view === 'buhead') return 'BU Head'
  if (persona.view === 'operator') return 'Operator'
  return 'Platform administrator'
}

export default function SettingsDrawer({
  open,
  onClose,
  dark,
  theme,
  profileImage,
  persona,
  customer,
  activeBU,
  dashboardSite,
  selectedUnitPath,
  onToggleDark,
  onThemeChange,
  onResetTheme,
  onProfileImageChange,
}: Props) {
  const [customColors, setCustomColors] = useState<CustomColors>(() => toColors(theme))
  const [photoError, setPhotoError] = useState('')

  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const roleLabel = getRoleLabel(persona)
  const customerLabel = customer?.name ?? (persona.type === 'external' ? 'Assigned customer' : 'All customers')
  const siteAccess = dashboardSite || 'All assigned sites'
  const unitAccess = selectedUnitPath.length > 1
    ? selectedUnitPath[selectedUnitPath.length - 1]
    : 'All units in scope'

  const accessDetails: AccessDetail[] = [
    { label: 'Role', value: roleLabel, Icon: ShieldCheck },
    { label: 'Email ID', value: 'ramachandra.m@thermax.com', Icon: Mail },
    { label: 'Business Unit', value: activeBU.toUpperCase(), Icon: Building2 },
  ]

  const hierarchyDetails = [
    { label: 'Customer', value: customerLabel, Icon: Building2 },
    { label: 'Site', value: siteAccess, Icon: MapPin },
    { label: 'Unit', value: unitAccess, Icon: Cpu },
  ]

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file || !file.type.startsWith('image/')) {
      setPhotoError('Please choose an image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be 5 MB or less.')
      return
    }

    setPhotoError('')
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') onProfileImageChange(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const updateCustomColor = (key: keyof CustomColors, value: string) => {
    setCustomColors((colors) => ({ ...colors, [key]: value }))
  }

  const applyPreset = (preset: ThemeConfig) => {
    setCustomColors({
      primary: preset.primary,
      accent: preset.accent,
      background: preset.background,
      card: preset.card,
    })
    onThemeChange(preset)
  }

  const applyCustomTheme = () => {
    onThemeChange({
      id: 'custom',
      label: 'Custom theme',
      ...customColors,
      dark,
    })
  }

  const resetToDefault = () => {
    setCustomColors(toColors(null))
    onResetTheme()
  }

  const appliedColors = toColors(theme)
  const isDefaultTheme = theme === null
  const isDirty =
    appliedColors.primary !== customColors.primary ||
    appliedColors.accent !== customColors.accent ||
    appliedColors.background !== customColors.background ||
    appliedColors.card !== customColors.card
  const canReset = !isDefaultTheme || isDirty

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end bg-slate-950/50"
      onClick={onClose}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
        className="flex h-full w-full max-w-md flex-col border-l theme-border bg-[var(--theme-card)] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b theme-border px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              aria-label="Back"
              className="rounded-lg p-2 text-[var(--theme-muted)] transition-colors hover:bg-black/5 hover:text-[var(--theme-text)] dark:hover:bg-white/5"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 id="settings-title" className="text-lg font-bold text-[var(--theme-text)]">Settings</h2>
              <p className="text-xs text-[var(--theme-muted)]">Manage your profile and workspace appearance</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="rounded-lg p-2 text-[var(--theme-muted)] transition-colors hover:bg-black/5 hover:text-[var(--theme-text)] dark:hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto bg-[var(--theme-background)] p-5">
          <section className="rounded-2xl border theme-border bg-[var(--theme-card)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Ramachandra M profile"
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--theme-primary)] text-sm font-bold theme-on-primary-text shadow-sm">
                    RM
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-[var(--theme-text)]">Ramachandra M</h3>
                  <p className="mt-0.5 text-xs text-[var(--theme-muted)]">Workspace profile</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <label
                  htmlFor="profile-photo-input"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border theme-border px-2.5 py-2 text-xs font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <Camera className="h-3.5 w-3.5" />
                  Change photo
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => onProfileImageChange(undefined)}
                    className="text-[11px] font-medium text-red-500 hover:text-red-400"
                  >
                    Remove photo
                  </button>
                )}
              </div>
            </div>
            {photoError && <p className="mt-3 text-xs text-red-500">{photoError}</p>}
            <div className="mt-5 border-t theme-border pt-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2 text-xs text-[var(--theme-muted)]">
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span>Display name</span>
                </div>
                <div className="flex min-w-0 items-center gap-2 text-right">
                  <span className="truncate text-xs font-semibold text-[var(--theme-text)]">Ramachandra M</span>
                  <Lock className="h-3.5 w-3.5 shrink-0 text-[var(--theme-muted)]" />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border theme-border bg-[var(--theme-card)] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg theme-primary-bg-soft theme-primary-text">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--theme-text)]">Access details</h3>
                <p className="text-[11px] text-[var(--theme-muted)]">Provided by your organization</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {accessDetails.map((detail) => {
                const Icon = detail.Icon
                return (
                  <div key={detail.label} className="rounded-xl bg-[var(--theme-background)] p-3">
                    <div className="flex items-center gap-2 text-[11px] text-[var(--theme-muted)]">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{detail.label}</span>
                    </div>
                    <p className="mt-2 truncate text-xs font-semibold text-[var(--theme-text)]" title={detail.value}>
                      {detail.value}
                    </p>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 rounded-xl border theme-border bg-[var(--theme-background)] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-muted)]">Access hierarchy</p>
              <nav aria-label="Access hierarchy" className="mt-2 flex flex-wrap items-center gap-2">
                {hierarchyDetails.map((detail, index) => {
                  const Icon = detail.Icon
                  return (
                    <div key={detail.label} className="flex min-w-0 items-center gap-2">
                      <div className="min-w-0 rounded-lg bg-[var(--theme-card)] p-2.5" title={`${detail.label}: ${detail.value}`}>
                        <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wide text-[var(--theme-muted)]">
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          {detail.label}
                        </div>
                        <p className="mt-1 max-w-[150px] truncate text-xs font-semibold text-[var(--theme-text)]">{detail.value}</p>
                      </div>
                      {index < hierarchyDetails.length - 1 && (
                        <ChevronRight className="h-4 w-4 shrink-0 text-[var(--theme-muted)]" aria-hidden="true" />
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[var(--theme-background)] px-3 py-3">
              <div className="flex items-center gap-2 text-xs text-[var(--theme-muted)]">
                <Lock className="h-4 w-4 shrink-0" />
                <span>Password</span>
              </div>
              <span className="text-right text-xs font-semibold text-[var(--theme-muted)]">Managed by administrator</span>
            </div>
          </section>

          <section className="rounded-2xl border theme-border bg-[var(--theme-card)] p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg theme-primary-bg-soft theme-primary-text">
                <Palette className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--theme-text)]">Theme Customizer</h3>
                <p className="text-[11px] text-[var(--theme-muted)]">Personalize your workspace colors</p>
              </div>
            </div>

            <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border theme-border p-3">
              <div>
                <p className="text-xs font-semibold text-[var(--theme-text)]">Color mode</p>
                <p className="mt-0.5 text-[11px] text-[var(--theme-muted)]">{dark ? 'Dark' : 'Light'} appearance</p>
              </div>
              <button
                type="button"
                onClick={onToggleDark}
                aria-pressed={dark}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--theme-primary)] px-3 py-2 text-xs font-semibold theme-on-primary-text transition-[filter] hover:brightness-95"
              >
                {dark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {dark ? 'Switch to light' : 'Switch to dark'}
              </button>
            </div>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">Preset Themes</p>
              <div className="grid grid-cols-2 gap-3">
                {themePresets.map((preset) => {
                  const isActive = theme?.id === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className={`rounded-xl border p-3 text-left transition-all hover:opacity-90 ${isActive ? 'ring-2 ring-[var(--theme-primary)]' : 'theme-border'}`}
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="truncate text-xs font-semibold text-[var(--theme-text)]">{preset.label}</span>
                        {isActive ? <Check className="h-3.5 w-3.5 shrink-0 theme-primary-text" /> : <span className="flex gap-1">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.primary }} />
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                        </span>}
                      </div>
                      <div className="mt-2 flex h-6 w-full overflow-hidden rounded border theme-border" style={{ backgroundColor: preset.background }}>
                        <div className="h-full w-1/3" style={{ backgroundColor: preset.card }} />
                        <div className="flex w-2/3 flex-col gap-1 p-1" style={{ backgroundColor: preset.background }}>
                          <div className="h-1.5 w-full rounded" style={{ backgroundColor: preset.card }} />
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-6 space-y-4 border-t theme-border pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--theme-muted)]">Custom Theme Builder</p>
              <div className="grid grid-cols-2 gap-4">
                {colorFields.map((field) => (
                  <div key={field.key}>
                    <span className="mb-1 block text-xs font-medium text-[var(--theme-text)]">{field.label}</span>
                    <div className="flex items-center gap-2 rounded-lg border theme-border p-1.5">
                      <input
                        type="color"
                        value={customColors[field.key]}
                        onChange={(event) => updateCustomColor(field.key, event.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                        aria-label={field.label}
                      />
                      <span className="font-mono text-xs uppercase text-[var(--theme-muted)]">{customColors[field.key]}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={resetToDefault}
                  disabled={!canReset}
                  className="rounded-xl border theme-border py-2.5 text-sm font-semibold text-[var(--theme-text)] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-white/5"
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={applyCustomTheme}
                  disabled={!isDirty}
                  className="rounded-xl bg-[var(--theme-primary)] py-2.5 text-sm font-semibold theme-on-primary-text shadow-md transition-[filter] hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Save
                </button>
              </div>
              <p className="text-[11px] text-[var(--theme-muted)]">
                {isDirty
                  ? 'Unsaved changes — select Save to apply them.'
                  : isDefaultTheme
                    ? 'Default app theme is active. Custom colors apply only after you save.'
                    : `Applying the “${theme?.label}” theme. Saved colors will replace it.`}
              </p>
            </div>
          </section>
        </div>
      </aside>
    </div>
  )
}
