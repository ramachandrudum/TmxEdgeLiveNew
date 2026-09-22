import { Bell, ChevronDown, Moon, Sun, Sparkles, Search, Settings } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import type { Customer } from '../data/dashboard'
import type { Persona, PersonaType, PersonaView } from '../data/personas'

type Props = {
  customer?: Customer | null
  customers?: Customer[]
  dark: boolean
  isDashboard?: boolean
  persona?: Persona
  onToggleDark: () => void
  onOpenAICopilot: () => void
  onSwitchCustomer?: (id: string) => void
  onSelectPersona?: (type: PersonaType, view: PersonaView) => void
  onCompare?: (type: string, items: string[]) => void
  buIconVisible?: boolean
  onToggleBu?: () => void
  buGradient?: boolean
  onToggleBuGradient?: () => void
}

const compareTypes = [
  { id: 'site', label: 'Compare Sites', desc: 'Compare KPIs across sites', icon: 'M12 22s7-7.58 7-12A7 7 0 0 0 5 10c0 4.42 7 12 7 12Z' },
  { id: 'unit', label: 'Compare Units', desc: 'Compare KPIs across units', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  { id: 'system', label: 'Compare Systems', desc: 'Compare KPIs across systems', icon: 'M3 3h18v18H3z' },
  { id: 'asset', label: 'Compare Assets', desc: 'Compare KPIs across individual assets', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
]

const compareItems: Record<string, string[]> = {
  site: ['Nestle UAE', 'Cairo Plant', 'Lagos Plant', 'Riyadh Plant'],
  unit: ['HVAC', 'Compressors'],
  system: ['Primary Cooling Water System', 'Secondary Cooling Water System', 'Cooling Water Condensor', 'Compressor System 1', 'Compressor System 2'],
  asset: ['Chiller 10', 'Chiller 20', 'Chiller 30', 'Cooling Tower A', 'Cooling Tower B', 'Primary Pump 1', 'Pump 3', 'Compressor 1', 'Compressor 2', 'Compressor 3'],
}

type GroupItem = { name: string; children?: string[] }

const systemGroups: GroupItem[] = [
  { name: 'HVAC', children: ['Primary Cooling Water System', 'Secondary Cooling Water System', 'Cooling Water Condensor'] },
  { name: 'Compressors', children: ['Compressor System 1', 'Compressor System 2'] },
]

const assetGroups: { name: string; children: { name: string; children: { name: string; children: string[] }[] }[] }[] = [
  { name: 'Nestle UAE', children: [
    { name: 'HVAC', children: [
      { name: 'Primary Cooling Water System', children: ['Chiller 10', 'Chiller 20', 'Chiller 30', 'Cooling Tower A', 'Cooling Tower B', 'Primary Pump 1'] },
      { name: 'Secondary Cooling Water System', children: ['Pump 3'] },
    ]},
    { name: 'Compressors', children: [
      { name: 'Compressor System 1', children: ['Compressor 1', 'Compressor 2'] },
      { name: 'Compressor System 2', children: ['Compressor 3'] },
    ]},
  ]},
]

export default function Header({ customer, customers, dark, isDashboard, persona, onToggleDark, onOpenAICopilot, onSwitchCustomer, onSelectPersona, onCompare, buIconVisible, onToggleBu, buGradient, onToggleBuGradient }: Props) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerQuery, setCustomerQuery] = useState('')
  const [compareOpen, setCompareOpen] = useState(false)
  const [compareStep, setCompareStep] = useState<1 | 2>(1)
  const [compareType, setCompareType] = useState('')
  const [compareSelected, setCompareSelected] = useState<string[]>([])
  const [compareSearch, setCompareSearch] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)

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
          {buIconVisible && (
            <button
              onClick={onToggleBu}
              title="Show BU bar"
              className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
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
                className="flex items-center gap-2 h-9 px-3 rounded-lg border border-gray-200 bg-white text-[15px] hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
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
          onClick={() => { setCompareOpen(true); setCompareStep(1); setCompareType(''); setCompareSelected([]) }}
          title="Compare"
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3 4 7l4 4" /><path d="M4 7h16" /><path d="m16 21 4-4-4-4" /><path d="M20 17H4" /></svg>
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">Compare</span>
        </button>
        <button
          onClick={onToggleDark}
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          {dark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={onOpenAICopilot}
          title="AI Copilot"
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">AI Copilot</span>
        </button>
        <button className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#C00000]" />
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">Notifications</span>
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
        <button
          onClick={() => setSettingsOpen(true)}
          title="Settings"
          className="relative w-8 h-8 flex items-center justify-center rounded-[5px] border border-gray-200 bg-white text-gray-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer shrink-0 group"
        >
          <Settings className="w-3.5 h-3.5" />
          <span className="absolute top-full mt-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">Settings</span>
        </button>
      </div>

      {compareOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={() => setCompareOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[420px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {compareStep === 1 ? (
              <>
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-[15px] font-bold text-gray-900">Compare</h3>
                </div>
                <div className="p-3 space-y-1">
                  {compareTypes.map((ct) => (
                    <button
                      key={ct.id}
                      onClick={() => { setCompareType(ct.id); setCompareStep(2); setCompareSelected([]); setCompareSearch('') }}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d={ct.icon} />
                        </svg>
                      </div>
                      <div>
                        <div className="text-[14px] font-bold text-gray-900">{ct.label}</div>
                        <div className="text-[12px] text-gray-500">{ct.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
                  <button onClick={() => setCompareOpen(false)} className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-5 py-4 border-b border-gray-200">
                  <h3 className="text-[15px] font-bold text-gray-900">Select {compareType === 'site' ? 'Sites' : compareType === 'unit' ? 'Units' : compareType === 'system' ? 'Systems' : 'Assets'} to Compare</h3>
                  <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
                    <Search className="w-3.5 h-3.5 text-gray-400" />
                    <input
                      value={compareSearch}
                      onChange={(e) => setCompareSearch(e.target.value)}
                      placeholder="Search..."
                      className="flex-1 bg-transparent outline-none text-[12px] text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="p-3 overflow-y-auto flex-1 min-h-0">
                  {compareType === 'site' || compareType === 'unit' ? (
                    <>
                      <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={compareSelected.length === (compareItems[compareType]?.length ?? 0)}
                          onChange={(e) => setCompareSelected(e.target.checked ? (compareItems[compareType] ?? []) : [])}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[13px] font-semibold text-gray-900">Select All</span>
                      </label>
                      <div className="border-t border-gray-100 my-1" />
                      {(compareItems[compareType] ?? []).filter((item) => item.toLowerCase().includes(compareSearch.toLowerCase())).map((item) => (
                        <label key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={compareSelected.includes(item)}
                            onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[13px] text-gray-700">{item}</span>
                        </label>
                      ))}
                    </>
                  ) : compareType === 'system' ? (
                    systemGroups.map((group) => {
                      const filteredChildren = group.children?.filter((c) => c.toLowerCase().includes(compareSearch.toLowerCase()))
                      if (compareSearch && (!filteredChildren || filteredChildren.length === 0)) return null
                      const allChildren = group.children ?? []
                      const allSelected = allChildren.length > 0 && allChildren.every((c) => compareSelected.includes(c))
                      return (
                        <div key={group.name} className="mb-2">
                          <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer bg-gray-50/50">
                            <input
                              type="checkbox"
                              checked={allSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCompareSelected([...compareSelected, ...allChildren.filter((c) => !compareSelected.includes(c))])
                                } else {
                                  setCompareSelected(compareSelected.filter((s) => !allChildren.includes(s)))
                                }
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{group.name}</span>
                          </label>
                          {filteredChildren?.map((item) => (
                            <label key={item} className="flex items-center gap-3 pl-8 pr-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={compareSelected.includes(item)}
                                onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-[13px] text-gray-700">{item}</span>
                            </label>
                          ))}
                        </div>
                      )
                    })
                  ) : (
                    assetGroups.map((site) => (
                      <div key={site.name} className="mb-3">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">{site.name}</div>
                        {site.children.map((unit) => (
                          <div key={unit.name} className="ml-3 mb-2">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{unit.name}</div>
                            {unit.children.map((system) => {
                              const filteredAssets = system.children.filter((a) => a.toLowerCase().includes(compareSearch.toLowerCase()))
                              if (compareSearch && filteredAssets.length === 0) return null
                              return (
                                <div key={system.name} className="ml-3 mb-1">
                                  <label className="flex items-center gap-3 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={filteredAssets.length > 0 && filteredAssets.every((a) => compareSelected.includes(a))}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setCompareSelected([...compareSelected, ...filteredAssets.filter((a) => !compareSelected.includes(a))])
                                        } else {
                                          setCompareSelected(compareSelected.filter((s) => !filteredAssets.includes(s)))
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-[11px] font-semibold text-gray-400">{system.name}</span>
                                  </label>
                                  {filteredAssets.map((item) => (
                                    <label key={item} className="flex items-center gap-3 pl-8 pr-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={compareSelected.includes(item)}
                                        onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-[13px] text-gray-700">{item}</span>
                                    </label>
                                  ))}
                                </div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
                <div className="px-5 py-3 border-t border-gray-200 flex justify-between">
                  <button onClick={() => { setCompareStep(1); setCompareSelected([]); setCompareSearch('') }} className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                    Back
                  </button>
                  <button
                    disabled={compareSelected.length === 0}
                    onClick={() => { onCompare?.(compareType, compareSelected); setCompareOpen(false) }}
                    className="px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Compare ({compareSelected.length})
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end" onClick={() => setSettingsOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-[340px] bg-white shadow-2xl h-full flex flex-col slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-900">Settings</h3>
              <button onClick={() => setSettingsOpen(false)} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer text-gray-500 hover:text-gray-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-4">
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Appearance</h4>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={buGradient}
                        onChange={() => onToggleBuGradient?.()}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-4" />
                    </div>
                    <span className="text-[13px] text-gray-700 group-hover:text-gray-900 transition-colors">BU Bar gradient background</span>
                  </label>
                  <p className="text-[11px] text-gray-400 mt-1.5 ml-[48px]">Toggle gradient bg for the BU bar. When off, text-only with white background.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}