import { Building2, Plus } from 'lucide-react'
import { useState } from 'react'
import AICopilot from './components/AICopilot'
import BUBar, { type BUItem } from './components/BUBar'
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

export default function App() {
  const [iconNav, setIconNav] = useState('home')
  const [activeBU, setActiveBU] = useState('ums')
  const [persona, setPersona] = useState<Persona>({ type: 'internal', view: 'management' })
  const [activeCustomer, setActiveCustomer] = useState('all')
  const [dark, setDark] = useState(false)
  const [page, setPage] = useState<'customers' | 'dashboard'>('customers')
  const [dashboardSite, setDashboardSite] = useState('')
  const [selectedUnitPath, setSelectedUnitPath] = useState<string[]>([])
  const [showAICopilot, setShowAICopilot] = useState(false)

  const currentCustomer = customers.find((c) => c.id === activeCustomer)
  const currentLabel = currentCustomer?.name ?? 'Polar Thermal Systems'
  const showOperatorView = persona.view === 'operator' && page === 'customers' && iconNav === 'home'
  const showExternalOperatorView = persona.type === 'external' && showOperatorView
  const showExternalManagementView = persona.type === 'external' && persona.view === 'management' && page === 'customers' && iconNav === 'home'
  const showCustomGrid = showExternalOperatorView || showExternalManagementView || (showOperatorView && !showExternalOperatorView) || persona.view === 'buhead'

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
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left icon rail */}
        <IconSidebar active={iconNav} onSelect={handleIconNav} navIds={personaNav[personaKey(persona)]} />

        {/* Right side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* BU bar below header */}
          {!showCustomGrid && page !== 'dashboard' && (
            <BUBar
              items={budgetUnits as BUItem[]}
              active={activeBU}
              onSelect={setActiveBU}
            />
          )}

          {/* Content area */}
          {showExternalOperatorView ? (
            <main className="flex-1 px-4 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-[1050px] mx-auto space-y-6 w-full pb-8 shrink-0 min-[1920px]:w-[1500px] min-[1920px]:max-w-[1500px]">
                <ExternalOperatorView
                  customer={currentCustomer ?? customers[0]}
                  onOpenDashboard={openDashboard}
                  hideMetrics
                />
              </div>
            </main>
          ) : showExternalManagementView ? (
            <main className="flex-1 px-4 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-[1050px] mx-auto space-y-6 w-full pb-8 shrink-0 min-[1920px]:w-[1500px] min-[1920px]:max-w-[1500px]">
                <ExternalOperatorView
                  customer={currentCustomer ?? customers[0]}
                  onOpenDashboard={openDashboard}
                />
              </div>
            </main>
          ) : showOperatorView ? (
            <div className="flex flex-1 min-h-0 overflow-hidden">
              <CustomerSidebar
                active={activeCustomer}
                onSelect={setActiveCustomer}
              />
              <main className="flex-1 px-4 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
                <div className="max-w-[1050px] mx-auto space-y-6 w-full pb-8 shrink-0 min-[1920px]:w-[1500px] min-[1920px]:max-w-[1500px]">
                  {activeCustomer === 'all' ? (
                    <>
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
                      <SummaryCards active={activeCustomer} />
                      <CustomerTable active={activeCustomer} onOpenDashboard={openDashboard} onSelectUnit={handleSelectUnit} />
                    </>
                  ) : (
                    <ExternalOperatorView
                      customer={currentCustomer!}
                      onOpenDashboard={openDashboard}
                      hideMetrics
                    />
                  )}
                </div>
              </main>
            </div>
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
            <main className="flex-1 px-4 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-[1050px] mx-auto space-y-6 w-full pb-8 shrink-0 min-[1920px]:w-[1500px] min-[1920px]:max-w-[1500px]">
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
                <PerformanceMetrics />

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