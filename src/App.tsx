import { Building2, Plus } from 'lucide-react'
import { useState } from 'react'
import AICopilot from './components/AICopilot'
import BUBar, { type BUItem } from './components/BUBar'
import CompareView from './components/CompareView'
import CustomerSidebar from './components/CustomerSidebar'
import Header from './components/Header'
import IconSidebar from './components/IconSidebar'
import SummaryCards from './components/SummaryCards'
import PerformanceMetrics from './components/PerformanceMetrics'
import CustomerTable from './components/CustomerTable'
import DashboardPage from './components/DashboardPage'
import ExternalOperatorView from './components/ExternalOperatorView'
import { budgetUnits, customers, generateSites } from './data/dashboard'
import { personaKey, personaNav, type Persona, type PersonaType, type PersonaView } from './data/personas'

const compareItems: Record<string, string[]> = {
  site: ['Nestle UAE', 'Cairo Plant', 'Lagos Plant', 'Riyadh Plant'],
  unit: ['HVAC', 'Compressors'],
  system: ['Primary Cooling Water System', 'Secondary Cooling Water System', 'Cooling Water Condensor', 'Compressor System 1', 'Compressor System 2'],
  asset: ['Chiller 10', 'Chiller 20', 'Chiller 30', 'Cooling Tower A', 'Cooling Tower B', 'Primary Pump 1', 'Pump 3', 'Compressor 1', 'Compressor 2', 'Compressor 3'],
}

export default function App() {
  const [iconNav, setIconNav] = useState('home')
  const [activeBU, setActiveBU] = useState('ums')
  const [persona, setPersona] = useState<Persona>({ type: 'internal', view: 'management' })
  const [activeCustomer, setActiveCustomer] = useState('all')
  const [dark, setDark] = useState(false)
  const [page, setPage] = useState<'customers' | 'dashboard' | 'incidents' | 'tasks' | 'report'>('customers')
  const [dashboardSite, setDashboardSite] = useState('')
  const [selectedUnitPath, setSelectedUnitPath] = useState<string[]>([])
  const [showAICopilot, setShowAICopilot] = useState(false)
  const [compareView, setCompareView] = useState<'select-type' | { type: string; items: string[] } | null>(null)
  const [buGradient, setBuGradient] = useState(false)

  const currentCustomer = customers.find((c) => c.id === activeCustomer)
  const currentLabel = currentCustomer?.name ?? 'Polar Thermal Systems'
  const showOperatorView = persona.view === 'operator' && page === 'customers' && iconNav === 'home'
  const showExternalOperatorView = persona.type === 'external' && showOperatorView
  const showExternalManagementView = persona.type === 'external' && persona.view === 'management' && page === 'customers' && iconNav === 'home'
  const showCustomGrid = showExternalOperatorView || showExternalManagementView || persona.view === 'buhead'
  const hidePerformanceMetrics = persona.type === 'internal' && persona.view === 'operator'

  const openDashboard = (siteName: string) => {
    setDashboardSite(siteName)
    setSelectedUnitPath([])
    setIconNav('dashboard')
    setPage('dashboard')
  }

  const handleSelectUnit = (siteName: string, unitName: string) => {
    setDashboardSite(siteName)
    setSelectedUnitPath([siteName, unitName])
    setIconNav('dashboard')
    setPage('dashboard')
  }

  const handleIconNav = (id: string) => {
    setIconNav(id)
    if (id === 'dashboard') {
      openDashboard(dashboardSite || generateSites(customers[0].id)[0]?.name || '')
    } else if (id === 'incidents') {
      setPage('incidents')
    } else if (id === 'tasks') {
      setPage('tasks')
    } else if (id === 'report') {
      setPage('report')
    } else {
      setPage('customers')
    }
  }

  const handleSwitchCustomer = (id: string) => {
    setActiveCustomer(id)
    const site = generateSites(id)[0]?.name || ''
    setDashboardSite(site)
    setSelectedUnitPath([])
    setIconNav('dashboard')
    setPage('dashboard')
  }

  const handleSelectPersona = (type: PersonaType, view: PersonaView) => {
    const nav = personaNav[personaKey({ type, view })]
    const first = nav[0] ?? 'home'
    setPersona({ type, view })
    setIconNav(first)
    if (first === 'dashboard') {
      setDashboardSite((s) => s || generateSites(customers[0].id)[0]?.name || '')
      setSelectedUnitPath([])
      setPage('dashboard')
    } else {
      setPage('customers')
    }
  }

  const handleOpenCompare = (type: string, items: string[]) => {
    setCompareView({ type, items })
  }

  const handleCompareBack = () => {
    setCompareView(null)
  }

  const handleCompareAddMore = () => {
    setCompareView(null)
  }

  const handleCompareReset = () => {
    if (compareView && typeof compareView === 'object') {
      setCompareView({ type: compareView.type, items: compareItems[compareView.type] ?? [] })
    }
  }

  return (
    <div className={`flex flex-col h-screen bg-[var(--bg-main)] overflow-hidden ${dark ? 'dark' : ''}`}>
      {/* Full-width Header top bar */}
      <Header
        customer={currentCustomer ?? (persona.type === 'external' ? customers[0] : null)}
        customers={customers}
        dark={dark}
        isDashboard={page === 'dashboard'}
        persona={persona}
        onToggleDark={() => setDark((d) => !d)}
        onOpenAICopilot={() => setShowAICopilot(true)}
        onSwitchCustomer={handleSwitchCustomer}
        onSelectPersona={handleSelectPersona}
        onCompare={handleOpenCompare}
        buGradient={buGradient}
        onToggleBuGradient={() => setBuGradient((g) => !g)}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left icon rail */}
        <IconSidebar active={iconNav} onSelect={handleIconNav} navIds={personaNav[personaKey(persona)]} buGradient={buGradient} />

        {/* Right side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* BU bar below header */}
          {!showCustomGrid && page !== 'dashboard' && page !== 'incidents' && page !== 'tasks' && page !== 'report' && persona.type !== 'external' && (
            <BUBar
              items={budgetUnits as BUItem[]}
              active={activeBU}
              onSelect={setActiveBU}
              gradient={buGradient}
            />
          )}

          {/* Content area */}
          {compareView && typeof compareView === 'object' ? (
            <CompareView
              compareType={compareView.type}
              items={compareView.items}
              onBack={handleCompareBack}
              onAddMore={handleCompareAddMore}
              onReset={handleCompareReset}
            />
          ) : page === 'incidents' || page === 'tasks' || page === 'report' ? (
            <div className="flex-1 flex items-center justify-center bg-white min-h-0">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4" />
                    <path d="M12 8h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{page === 'incidents' ? 'Incidents' : page === 'tasks' ? 'Tasks' : 'Reports'}</h3>
                <p className="text-sm text-gray-500">No data available yet</p>
              </div>
            </div>
          ) : showExternalOperatorView ? (
            <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-full sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1050px] xl:max-w-[1200px] min-[1920px]:max-w-[1500px] mx-auto space-y-6 w-full pb-8 shrink-0">
                <ExternalOperatorView
                  customer={currentCustomer ?? customers[0]}
                  onOpenDashboard={openDashboard}
                  hideMetrics
                />
              </div>
            </main>
          ) : showExternalManagementView ? (
            <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-full sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1050px] xl:max-w-[1200px] min-[1920px]:max-w-[1500px] mx-auto space-y-6 w-full pb-8 shrink-0">
                <ExternalOperatorView
                  customer={currentCustomer ?? customers[0]}
                  onOpenDashboard={openDashboard}
                  hideSiteDetails
                />
              </div>
            </main>
          ) : page === 'dashboard' ? (
            <DashboardPage
              siteName={dashboardSite}
              selectedUnitPath={selectedUnitPath}
            />
          ) : (
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
            {/* Customers sidebar - internal only */}
            {persona.type !== 'external' && (
            <CustomerSidebar
              active={activeCustomer}
              onSelect={setActiveCustomer}
            />
            )}

            {/* Main content */}
            <main className="flex-1 px-3 sm:px-4 md:px-6 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-full sm:max-w-[700px] md:max-w-[900px] lg:max-w-[1050px] xl:max-w-[1200px] min-[1920px]:max-w-[1500px] mx-auto space-y-6 w-full pb-8 shrink-0">
                {/* Section header */}
                {activeCustomer === 'all' ? (
                  <div className="section-head flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 14 }}>
                    <div className="header-title flex items-center gap-2.5">
                      <div className="header-icon w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 21V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 21v-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">All Customers</h3>
                        <div className="header-sub text-xs text-gray-500">{customers.length} customers</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="sidebar-add-btn flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold shadow-sm hover:bg-blue-700 transition-all cursor-pointer">
                        <Plus className="w-3.5 h-3.5" strokeWidth={2.4} />
                        Add Customer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="header-row flex items-center justify-between flex-wrap gap-3 mb-[15px]">
                    <div className="header-title flex items-center gap-3">
                      <div className="header-icon flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                        <Building2 className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 leading-tight">
                          {currentLabel}
                        </h2>
                        <div className="header-sub text-xs text-gray-500 font-medium mt-0.5">
                          {currentCustomer?.sites} sites
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Summary cards */}
                <SummaryCards active={activeCustomer} />

                {/* Performance metrics */}
                {!hidePerformanceMetrics && <PerformanceMetrics />}

                {/* Customer table */}
                <CustomerTable active={activeCustomer} onOpenDashboard={openDashboard} onSelectUnit={handleSelectUnit} />
              </div>
            </main>
          </div>
          )}
        </div>

        {/* AI Copilot overlay */}
        <AICopilot
          open={showAICopilot}
          onClose={() => setShowAICopilot(false)}
          customer={currentCustomer}
          activeBU={activeBU}
          site={dashboardSite || undefined}
        />
      </div>
    </div>
  )
}