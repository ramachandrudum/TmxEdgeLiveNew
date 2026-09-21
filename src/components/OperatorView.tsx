import { AlertTriangle, Building2, CheckCircle, ChevronRight, Clock, Zap } from 'lucide-react'
import { generateSites, type Customer } from '../data/dashboard'
import SummaryCards from './SummaryCards'

type Props = {
  customer: Customer
  onOpenDashboard: (siteName: string) => void
  hideHeaderBorder?: boolean
  hideMetrics?: boolean
}

const columns = 'grid-cols-[minmax(220px,2fr)_1fr_1fr_1.2fr_1fr_1.4fr]'

const metrics = [
  {
    num: '44%',
    label: 'Avg Risk Score',
    caption: (name: string) => `Across all assets, ${name}`,
    icon: Zap,
    bg: '#FFF3E0',
    color: '#E65100',
  },
  {
    num: '15%',
    label: 'Critical Asset Ratio',
    caption: () => 'Share of assets in critical state',
    icon: AlertTriangle,
    bg: '#FFEBEE',
    color: '#dc3545',
  },
  {
    num: '33%',
    label: 'Task Completion Rate',
    caption: (name: string) => `Of all tasks raised, ${name}`,
    icon: CheckCircle,
    bg: '#E8F5E9',
    color: '#2E7D32',
  },
  {
    num: '50%',
    label: 'On-Time Task Rate',
    caption: (name: string) => `Not overdue, ${name}`,
    icon: Clock,
    bg: '#E3F2FD',
    color: '#1565C0',
  },
]

export default function OperatorView({ customer, onOpenDashboard, hideHeaderBorder, hideMetrics }: Props) {
  const sites = generateSites(customer.id)

  return (
    <>
      <div
        className={`flex items-center justify-between flex-wrap gap-3 ${
          hideHeaderBorder ? 'mb-[15px]' : 'pb-4 border-b border-gray-200 mb-4'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Building2 className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h2>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{customer.sites} sites</div>
          </div>
        </div>
      </div>

      <SummaryCards active={customer.id} />

      {!hideMetrics && (
        <div style={{ marginTop: 28 }}>
          <div className="text-sm font-bold text-gray-800 mb-3">Performance Metrics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => {
              const Icon = m.icon
              return (
                <div
                  key={m.label}
                  className="bg-white border border-gray-200 rounded-md px-2 py-[5px] flex items-center gap-3"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: m.bg, color: m.color }}
                  >
                    <Icon className="w-[15px] h-[15px]" strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-gray-900">{m.num}</span>
                      <span className="text-xs text-gray-900 font-semibold">{m.label}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{m.caption(customer.name)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden p-3">
          <div className="space-y-3">
            {sites.map((site) => (
            <div
              key={site.id}
              onClick={() => onOpenDashboard(site.name)}
              className={`grid ${columns} gap-2 items-center bg-white border border-gray-200 rounded-md px-4 py-3 ml-[30px] hover:border-blue-200 transition-all cursor-pointer group/site`}
            >
              <div className="min-w-0 max-w-[180px]">
                <div className="text-sm font-semibold text-gray-900 truncate">{site.name}</div>
                <div className="text-xs text-gray-500">{site.units} units</div>
              </div>
              <div />

              <div className="pr-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-gray-900">{site.assets.value}</span>
                  <span className="text-[10px] text-gray-500">Assets</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 whitespace-nowrap">
                  {site.assets.legends.map((l) => (
                    <div key={l.label} className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                      {l.label}
                      <b className="text-gray-900 ml-0.5">{l.value}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pr-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-gray-900">{site.incidents.value}</span>
                  <span className="text-[10px] text-gray-500">Incidents</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 whitespace-nowrap">
                  {site.incidents.legends.map((l) => (
                    <div key={l.label} className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                      {l.label}
                      <b className="text-gray-900 ml-0.5">{l.value}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pr-4">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-base font-bold text-gray-900">{site.tasks.value}</span>
                  <span className="text-[10px] text-gray-500">Tasks</span>
                </div>
                <div className="mt-1.5 flex items-center gap-3 whitespace-nowrap">
                  {site.tasks.legends.map((l) => (
                    <div key={l.label} className="flex items-center gap-1 text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                      {l.label}
                      <b className="text-gray-900 ml-0.5">{l.value}</b>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover/site:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </>
  )
}