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
import { budgetUnits, customers, generateSites } from './data/dashboard'

export default function App() {
  const [iconNav, setIconNav] = useState('home')
  const [activeBU, setActiveBU] = useState('ums')
  const [activeCustomer, setActiveCustomer] = useState('all')
  const [dark, setDark] = useState(false)
  const [page, setPage] = useState<'customers' | 'dashboard'>('customers')
  const [dashboardSite, setDashboardSite] = useState('')
  const [selectedUnitPath, setSelectedUnitPath] = useState<string[]>([])
  const [showAICopilot, setShowAICopilot] = useState(false)

  const currentCustomer = customers.find((c) => c.id === activeCustomer)
  const currentLabel = currentCustomer?.name ?? 'Polar Thermal Systems'

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

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-main)] overflow-hidden">
      {/* Full-width Header top bar */}
      <Header
        title="Dashboard"
        breadcrumbs={['Home', 'Keep Cooling']}
        current={currentLabel}
        customer={currentCustomer}
        customers={customers}
        dark={dark}
        isDashboard={page === 'dashboard'}
        onToggleDark={() => setDark((d) => !d)}
        onOpenAICopilot={() => setShowAICopilot(true)}
        onSwitchCustomer={handleSwitchCustomer}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left icon rail */}
        <IconSidebar active={iconNav} onSelect={handleIconNav} />

        {/* Right side */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* BU bar below header */}
          {page !== 'dashboard' && (
            <BUBar
              items={budgetUnits as BUItem[]}
              active={activeBU}
              onSelect={setActiveBU}
            />
          )}

          {/* Content area */}
          {page === 'dashboard' ? (
            <DashboardPage
              siteName={dashboardSite}
              onBack={() => {
                setPage('customers')
                setIconNav('home')
              }}
              selectedUnitPath={selectedUnitPath}
            />
          ) : (
      <div className="relative flex flex-1 min-h-0 overflow-hidden">
            {/* Customers sidebar */}
            <CustomerSidebar
              active={activeCustomer}
              onSelect={setActiveCustomer}
            />

            {/* Main content */}
            <main className="flex-1 px-4 lg:px-8 pt-[15px] pb-0 overflow-y-auto min-h-0 flex flex-col bg-white">
              <div className="max-w-[1050px] mx-auto space-y-6 w-full pb-8 shrink-0 min-[1920px]:w-[1500px] min-[1920px]:max-w-[1500px]">
                {/* Section header */}
                {activeCustomer === 'all' ? (
                  <div className="section-head flex items-center justify-between flex-wrap gap-3" style={{ marginBottom: 14 }}>
                    <h3 className="text-base font-bold text-gray-900">All Customers</h3>
                    <div className="flex items-center gap-3">
                      <span className="section-sub text-xs text-gray-500">
                        All customers · updated live
                      </span>
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