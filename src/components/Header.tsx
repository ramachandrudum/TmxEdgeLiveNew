import { Bell, Building2, ChevronDown, Moon, Sun, Sparkles } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import type { Customer } from '../data/dashboard'
import type { Persona, PersonaType, PersonaView } from '../data/personas'

type Props = {
  title: string
  breadcrumbs: string[]
  current: string
  customer?: Customer | null
  customers?: Customer[]
  dark: boolean
  isDashboard?: boolean
  persona?: Persona
  onToggleDark: () => void
  onOpenAICopilot: () => void
  onSwitchCustomer?: (id: string) => void
  onSelectPersona?: (type: PersonaType, view: PersonaView) => void
}

export default function Header({ title, breadcrumbs, current, customer, customers, dark, isDashboard, persona, onToggleDark, onOpenAICopilot, onSwitchCustomer, onSelectPersona }: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerQuery, setCustomerQuery] = useState('')

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
    <header className="h-[50px] border-b border-gray-200 bg-[#ecf2fa] flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <img alt="TMX EdgeLive" className="h-[38px] w-auto object-contain shrink-0" src="/tmxEdgeLive.png?v=2" />
          {customer && persona?.type === 'external' && (
            <>
              <div className="w-px h-6 bg-gray-300 shrink-0" />
              <div className="flex items-center justify-center shrink-0">
                <CustomerLogo customer={customer} size="lg" />
              </div>
            </>
          )}
          {isDashboard && customers && (
            <div className="relative shrink-0">
              <button
                onClick={() => setCustomerOpen((o) => !o)}
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white shadow-sm text-[15px] hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
              >
                <span className="max-w-[160px] truncate text-gray-800 font-medium">{customer?.name ?? customers[0]?.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
              {customerOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-3 pb-2 border-b border-gray-100">
                    <input
                      autoFocus
                      value={customerQuery}
                      onChange={(e) => setCustomerQuery(e.target.value)}
                      placeholder="Search customers..."
                      className="w-full px-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
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
          onClick={onToggleDark}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0"
        >
          {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={onOpenAICopilot}
          title="AI Copilot"
          className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C00000]" />
        </button>
        <div className="relative ml-1">
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-1.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#5B5FC7] flex items-center justify-center text-white font-bold text-xs shadow-sm group-hover:opacity-90 transition-all">
              RM
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-900 transition-all" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 fade-in">
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
              <div className="py-1 px-1">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md cursor-pointer">
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
    </header>
  )
}