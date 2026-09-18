import { Bell, Building2, ChevronDown, Moon, Sun, Sparkles } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import type { Customer } from '../data/dashboard'

type Props = {
  title: string
  breadcrumbs: string[]
  current: string
  customer?: Customer | null
  customers?: Customer[]
  dark: boolean
  isDashboard?: boolean
  onToggleDark: () => void
  onOpenAICopilot: () => void
  onSwitchCustomer?: (id: string) => void
}

export default function Header({ title, breadcrumbs, current, customer, customers, dark, isDashboard, onToggleDark, onOpenAICopilot, onSwitchCustomer }: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerQuery, setCustomerQuery] = useState('')

  return (
    <header className="h-[50px] border-b border-gray-200 bg-[#ecf2fa] flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-6 flex-1 min-w-0">
        <div className="flex items-center gap-4 min-w-0">
          <img alt="TMX EdgeLive" className="h-[38px] w-auto object-contain shrink-0" src="/tmxEdgeLive.png" />
          {customer && (
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
                <span className="max-w-[160px] truncate text-gray-800 font-semibold">{customer?.name ?? customers[0]?.name}</span>
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
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <div className="text-sm font-bold text-gray-900">Ramachandra M</div>
                <div className="text-xs text-gray-500">Admin</div>
              </div>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                Settings
              </button>
              <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}