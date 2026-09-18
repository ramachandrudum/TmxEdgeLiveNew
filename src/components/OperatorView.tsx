import { AlertTriangle, Building2, CheckCircle, ChevronDown, Clock, ExternalLink, Zap } from 'lucide-react'
import { useState } from 'react'
import { generateSites, type Customer, type SiteStat, type UnitStat } from '../data/dashboard'
import SummaryCards from './SummaryCards'

type Props = {
  customer: Customer
  onOpenDashboard: (siteName: string) => void
  onSelectUnit: (siteName: string, unitName: string) => void
  hideHeaderBorder?: boolean
}

const STATUS_COLOR: Record<UnitStat['status'], string> = {
  healthy: '#0A6347',
  critical: '#C1292E',
  offline: '#C1292E',
}

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

const siteColumns = 'grid-cols-[24px_minmax(220px,2fr)_1fr_1fr_1.2fr_1fr_1.4fr]'
const unitColumns = 'grid-cols-[24px_minmax(160px,2fr)_1fr_1fr_1.2fr_1fr]'

function UnitTable({ units, onSelectUnit }: { units: UnitStat[]; onSelectUnit: (unitName: string) => void }) {
  return (
    <div className="border bg-[#F8FAFC]">
      <div className={`grid ${unitColumns} gap-2 items-center px-3 py-2 border-y border-gray-100 bg-[#ECF2FA]`}>
        <span />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Availability</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Incidents</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
      </div>
      {units.map((unit) => {
        const color = STATUS_COLOR[unit.status]
        return (
          <div
            key={unit.id}
            onClick={() => onSelectUnit(unit.name)}
            className={`grid ${unitColumns} gap-2 items-center px-3 py-2 border-b border-gray-100 last:border-b-0 hover:bg-blue-50/50 transition-colors cursor-pointer`}
          >
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <div className="min-w-0">
              <div className="text-sm text-gray-900 truncate">{unit.name}</div>
            </div>
            <div className="text-sm text-gray-700">{unit.health}%</div>
            <div className="text-sm text-gray-700">{unit.assets.total}</div>
            <div className="text-sm text-gray-700">{unit.incidents.total}</div>
            <div className="text-sm text-gray-700">{unit.tasks.total}</div>
          </div>
        )
      })}
    </div>
  )
}

function SiteRow({ site, onOpenDashboard, onSelectUnit }: { site: SiteStat; onOpenDashboard: (siteName: string) => void; onSelectUnit: (siteName: string, unitName: string) => void }) {
  const [open, setOpen] = useState(false)
  const totals = site.unitList.reduce(
    (acc, unit) => ({
      assets: acc.assets + unit.assets.total,
      incidents: acc.incidents + unit.incidents.total,
      tasks: acc.tasks + unit.tasks.total,
    }),
    { assets: 0, incidents: 0, tasks: 0 },
  )

  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        onClick={() => setOpen((o) => !o)}
        className={`grid ${siteColumns} gap-2 items-center px-3 py-3 transition-colors hover:bg-gray-50 cursor-pointer group/site`}
      >
        <ChevronDown
          className={`w-4 h-4 text-gray-300 group-hover/site:text-blue-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
        <div className="min-w-0 max-w-[220px]">
          <div className="text-sm font-semibold text-gray-900 truncate">{site.name}</div>
          <div className="text-xs text-gray-500">Last updated {site.updated}</div>
        </div>
        <div className="text-sm text-gray-700">{site.units} units</div>
        <div className="text-sm text-gray-700">{totals.assets} assets</div>
        <div className="text-sm text-gray-700">{totals.incidents} incidents</div>
        <div className="text-sm text-gray-700">{totals.tasks} tasks</div>
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDashboard(site.name)
            }}
            className="btn btn-md text-[#005EDB] border border-[#005EDB]/25 hover:bg-[#005EDB] hover:text-white hover:shadow-md"
          >
            Go to Dashboard <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
      {open && <UnitTable units={site.unitList} onSelectUnit={(unitName) => onSelectUnit(site.name, unitName)} />}
    </div>
  )
}

export default function OperatorView({ customer, onOpenDashboard, onSelectUnit, hideHeaderBorder }: Props) {
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

      <div style={{ marginTop: 28 }}>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`grid ${siteColumns} gap-2 items-center px-3 py-2.5 border-b border-gray-100 bg-[#ECF2FA]`}
          >
            <span />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Incidents</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
            <span />
          </div>
          {sites.map((site) => (
            <SiteRow key={site.id} site={site} onOpenDashboard={onOpenDashboard} onSelectUnit={onSelectUnit} />
          ))}
        </div>
      </div>
    </>
  )
}