import { Bell, ChevronDown, Sparkles } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import type { Customer } from '../data/dashboard'
import type { Persona, PersonaType, PersonaView } from '../data/personas'
import CompareSelectPopup from './CompareSelectPopup'

type Props = {
  customer?: Customer | null
  customers?: Customer[]
  isDashboard?: boolean
  persona?: Persona
  profileImage?: string
  onOpenAICopilot: () => void
  onOpenSettings: () => void
  onSwitchCustomer?: (id: string) => void
  onSelectPersona?: (type: PersonaType, view: PersonaView) => void
  onCompare?: (type: string, items: string[]) => void
  buIconVisible?: boolean
  onToggleBu?: () => void
  buGradient?: boolean
  onToggleBuGradient?: () => void
}

export default function Header({ customer, customers, isDashboard, persona, profileImage, onOpenAICopilot, onOpenSettings, onSwitchCustomer, onSelectPersona, onCompare, buIconVisible, onToggleBu, buGradient, onToggleBuGradient }: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerQuery, setCustomerQuery] = useState('')
  const [compareOpen, setCompareOpen] = useState(false)

  const activeType = persona?.type ?? 'internal'
  const activeView = persona?.view ?? 'management'
  const isActive = (t: PersonaType, v: PersonaView) => activeType === t && activeView === v

  const submenuItem = (t: PersonaType, v: PersonaView, label: string) => (
    <button
      onClick={() => {
        onSelectPersona?.(t, v)
        setProfileOpen(false)
      }}
      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[13px] transition-all cursor-pointer ${
        isActive(t, v)
          ? 'bg-blue-50 text-blue-700 font-semibold'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      {label}
      {isActive(t, v) && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
    </button>
  )

  return (
    <header className="h-[50px] border-b border-gray-200 bg-[var(--bg-header)] flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          {buIconVisible && (
            <button
              onClick={onToggleBu}
              title="Show BU bar"
              className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-[var(--theme-card)] text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path>
              </svg>
              <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">BU Bar</span>
            </button>
          )}
          <img alt="TMX EdgeLive" className="h-[30px] w-auto object-contain shrink-0" src="/Thermax-EDGE-Live-Logo-V1.png" />
          {customer && persona?.type === 'external' && (
            <>
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <div className="flex items-center justify-center shrink-0">
                <CustomerLogo customer={customer} size="lg" />
              </div>
            </>
          )}
          {isDashboard && customers && persona?.type !== 'external' && (
            <div className="relative shrink-0">
              <button
                onClick={() => setCustomerOpen((o) => !o)}
                className="flex items-center gap-2 px-2 pt-1 pb-1 rounded-lg border border-gray-200 bg-[var(--theme-card)] text-[15px] hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <span className="flex flex-col items-start leading-none">
                  <span className="text-[10px] text-gray-400 leading-tight">Customer</span>
                  <span className="max-w-[160px] truncate text-gray-800 font-medium text-sm">{customer?.name ?? customers[0]?.name}</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              </button>
              {customerOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-[var(--theme-card)] rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-3 pb-2 border-b border-gray-100">
                    <input
                      autoFocus
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      placeholder="Search customers..."
                      className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-[var(--theme-card)] transition-all"
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                  {customers.filter((c) => c.name.toLowerCase().includes(customerQuery.toLowerCase())).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        onSwitchCustomer?.(c.id)
                        setCustomerOpen(false)
                        setCustomerQuery('')
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      <span className="flex-1 text-left truncate">{c.name}</span>
                      {c.id === customer?.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />}
                    </button>
                  ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => setCompareOpen(true)}
          title="Compare"
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-[var(--theme-card)] text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></svg>
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">Compare</span>
        </button>
        <button
          onClick={onOpenAICopilot}
          title="AI Copilot"
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-[var(--theme-card)] text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">AI Copilot</span>
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-[var(--theme-card)] text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[var(--status-critical-text)]" />
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">Notifications</span>
        </button>
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt="Ramachandra M profile"
                className="w-8 h-8 rounded-full object-cover shadow-sm group-hover:opacity-90 transition-all"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[var(--theme-primary)] flex items-center justify-center theme-on-primary-text font-bold text-xs shadow-sm group-hover:opacity-90 transition-all">
                RM
              </div>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-all" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[var(--theme-card)] rounded-lg shadow-xl border border-gray-200 py-1 z-50 fade-in">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-bold text-gray-900">Ramachandra M</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>

              {/* Internal user */}
              <div className={`flex items-center gap-2.5 px-3 py-2 mt-1 text-[13px] font-semibold ${activeType === 'internal' ? 'text-gray-900' : 'text-gray-700'}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="9" cy="8" r="3" />
                  <circle cx="17" cy="9" r="2.4" />
                  <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M14.5 14.3c2.8.2 5 2.4 5.3 5.7" strokeLinecap="round" />
                </svg>
                <div>Internal user</div>
              </div>
              <div className="pl-10 pr-3 pb-2 flex flex-col">
                {submenuItem('internal', 'management', 'Management View')}
                {submenuItem('internal', 'buhead', 'BU Head View')}
                {submenuItem('internal', 'operator', 'Operator View')}
              </div>

              <div className="mx-3 border-t border-gray-100" />

              {/* External user */}
              <div className={`flex items-center gap-2.5 px-3 py-2 mt-1 text-[13px] font-semibold ${activeType === 'external' ? 'text-gray-900' : 'text-gray-700'}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M4 21V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 21v-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>External user</div>
              </div>
              <div className="pl-10 pr-3 pb-2 flex flex-col">
                {submenuItem('external', 'management', 'Management View')}
                {submenuItem('external', 'operator', 'Operator View')}
              </div>

              <div className="mx-3 border-t border-gray-100" />
              <div className="px-4 py-3">
                <h4 className="text-[13px] font-semibold text-gray-900 mb-2">Appearance</h4>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={buGradient}
                      onChange={() => onToggleBuGradient?.()}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-[var(--theme-card)] rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                  </div>
                  <span className="text-[13px] text-gray-700 group-hover:text-gray-900 transition-colors">BU Bar gradient background</span>
                </label>
                <p className="text-[11px] text-gray-400 mt-1.5 ml-[48px]">Toggle gradient bg for the BU bar. When off, text-only with white background.</p>
              </div>
              <div className="py-1 px-1">
                <button
                  onClick={() => {
                    setProfileOpen(false)
                    onOpenSettings()
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer"
                >
                  Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 rounded-md cursor-pointer">
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {compareOpen && (
        <CompareSelectPopup
          onClose={() => setCompareOpen(false)}
          onConfirm={(type, items) => {
            onCompare?.(type, items)
            setCompareOpen(false)
          }}
        />
      )}
    </header>
  )
}