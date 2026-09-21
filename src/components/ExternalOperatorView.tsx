import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  Info,
  Tags,
  Wrench,
  FileBarChart,
  History,
} from 'lucide-react'
import { useState } from 'react'
import { generateSites, type Customer, type SiteStat, type UnitStat } from '../data/dashboard'
import SummaryCards from './SummaryCards'

type Props = {
  customer: Customer
  onOpenDashboard: (siteName: string) => void
  onSelectUnit: (siteName: string, unitName: string) => void
}

const STATUS_COLOR: Record<UnitStat['status'], string> = {
  healthy: '#0A6347',
  critical: '#dc3545',
  offline: '#dc3545',
}

const siteColumns = 'grid-cols-[minmax(200px,2fr)_1fr_1fr_1.2fr_1fr_1.3fr_24px]'
const unitColumns = 'grid-cols-[24px_minmax(160px,2fr)_1fr_1fr_1.2fr_1fr]'

const recentActivity = [
  {
    id: 'ra1',
    kind: 'warn',
    title: '10 new incidents in HVAC',
    sub: 'Vibration levels are beyond the acceptable threshold',
    path: ['Nestle UAE', 'HVAC'],
  },
  {
    id: 'ra2',
    kind: 'ok',
    title: 'Chiller 10 preventive maintenance completed',
    sub: 'All tasks for August 2026 are completed',
    path: ['Nestle UAE', 'HVAC', 'Chiller 10'],
  },
  {
    id: 'ra3',
    kind: 'ok',
    title: 'Chiller 10 preventive maintenance completed',
    sub: 'All tasks for August 2026 are completed',
    path: ['Nestle UAE', 'HVAC', 'Chiller 10'],
  },
  {
    id: 'ra4',
    kind: 'warn',
    title: '10 new incidents in Compressor',
    sub: 'Vibration levels are beyond the acceptable threshold',
    path: ['Nestle UAE', 'Compressors'],
  },
  {
    id: 'ra5',
    kind: 'warn',
    title: '10 new incidents in Compressor',
    sub: 'Vibration levels are beyond the acceptable threshold',
    path: ['Nestle UAE', 'Compressors'],
  },
]

const lastViewed = [
  {
    id: 'lv1',
    type: 'asset',
    time: null as string | null,
    title: 'Chiller 10',
    sub: 'Risk Score : 89.6% ▲ 10%',
    avatar: null as string | null,
    path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'],
  },
  {
    id: 'lv2',
    type: 'incident',
    time: '02/08/2026, 9:00 am',
    title: 'Compressor Specific Power High',
    sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%',
    avatar: null,
    path: ['Nestle UAE', 'HVAC', 'Chiller 10'],
  },
  {
    id: 'lv3',
    type: 'task',
    time: null,
    title: 'Inspect Cooling Tower Fans',
    sub: 'Overdue by : 1d 4h',
    avatar: 'AJ',
    path: ['Nestle UAE', 'HVAC', 'Cooling Tower A'],
  },
  {
    id: 'lv4',
    type: 'incident',
    time: '02/08/2026, 9:00 am',
    title: 'Compressor Specific Power High',
    sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%',
    avatar: null,
    path: ['Nestle UAE', 'HVAC', 'Chiller 10'],
  },
]

const quickLinks = [
  {
    id: 'ql1',
    title: 'Logbook',
    desc: 'View all the shift handover information logged by operators on-site',
    icon: ClipboardList,
  },
  {
    id: 'ql2',
    title: 'Asset Monitor',
    desc: 'View real-time health and risk trends for every monitored asset',
    icon: Wrench,
  },
  {
    id: 'ql3',
    title: 'Consumption Reports',
    desc: 'View power, thermal, and water consumption reports across all sites',
    icon: FileBarChart,
  },
  {
    id: 'ql4',
    title: 'Tags',
    desc: 'View and manage asset tags across all sites and monitored units',
    icon: Tags,
  },
  {
    id: 'ql5',
    title: 'Service History',
    desc: 'View past maintenance visits and completed work orders across all sites',
    icon: History,
  },
]

function TrailPath({ path }: { path: string[] }) {
  return (
    <div className="text-[11px] text-gray-500 truncate">
      {path.map((p, i) => (
        <span key={i}>
          {i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}
          {p}
        </span>
      ))}
    </div>
  )
}

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
        <div className="min-w-0 max-w-[200px]">
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
            className="text-[#005EDB] text-sm font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#005EDB] hover:bg-[#005EDB] hover:text-white hover:shadow-md transition-all group-hover/site:bg-[#005EDB] group-hover/site:text-white group-hover/site:shadow-md"
          >
            View Site <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-300 group-hover/site:text-blue-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </div>
      {open && <UnitTable units={site.unitList} onSelectUnit={(unitName) => onSelectUnit(site.name, unitName)} />}
    </div>
  )
}

export default function ExternalOperatorView({ customer, onOpenDashboard, onSelectUnit }: Props) {
  const sites = generateSites(customer.id)
  const [activeSite, setActiveSite] = useState<string>('all')

  const visibleSites = activeSite === 'all' ? sites : sites.filter((s) => s.name === activeSite)

  return (
    <>
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 text-blue-600 shrink-0">
            <Building2 className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h2>
            <div className="text-xs text-gray-500 font-medium mt-0.5">
              {customer.sites} sites · {customer.units} units (
              {activeSite === 'all' ? 'All Sites' : activeSite})
            </div>
          </div>
        </div>
        <button
          onClick={() => onOpenDashboard(sites[0]?.name ?? '')}
          className="btn btn-md text-[#005EDB] border border-[#005EDB]/25 hover:bg-[#005EDB] hover:text-white hover:shadow-md"
        >
          Go to Dashboard <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Site chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveSite('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            activeSite === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Sites
        </button>
        {sites.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSite(s.name)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              activeSite === s.name
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Summary cards */}
      <SummaryCards active={customer.id} />

      {/* 3-column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-800">
            Recent Activity
          </div>
          <div>
            {recentActivity.map((item) => (
              <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      item.kind === 'warn' ? 'bg-[#FFF3E0] text-[#E65100]' : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {item.kind === 'warn' ? (
                      <Info className="w-3.5 h-3.5" strokeWidth={1.8} />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{item.sub}</div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                <div className="mt-2">
                  <TrailPath path={item.path} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Last Viewed */}
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-800">
            Last Viewed
          </div>
          <div>
            {lastViewed.map((item) => (
              <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center gap-2.5 cursor-pointer group">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      item.type === 'asset'
                        ? 'bg-[#E3F2FD] text-[#1565C0]'
                        : item.type === 'incident'
                          ? 'bg-[#FFEBEE] text-[#dc3545]'
                          : 'bg-[#E8F5E9] text-[#2E7D32]'
                    }`}
                  >
                    {item.type === 'asset' ? (
                      <Wrench className="w-3.5 h-3.5" strokeWidth={1.8} />
                    ) : item.type === 'incident' ? (
                      <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.8} />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} />
                    )}
                  </span>
                  <div className="flex-1 min-w-0">
                    {item.time && <div className="text-[10px] text-gray-400">{item.time}</div>}
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#dc3545] shrink-0" />
                      <div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {item.title}
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{item.sub}</div>
                  </div>
                  {item.avatar && (
                    <span className="w-6 h-6 rounded-full bg-[#5B5FC7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {item.avatar}
                    </span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                <div className="mt-2">
                  <TrailPath path={item.path} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon
            return (
              <button
                key={link.id}
                className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-md text-left hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group"
              >
                <span className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" strokeWidth={1.8} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-gray-900">{link.title}</span>
                  <span className="block text-[11px] text-gray-500">{link.desc}</span>
                </span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </button>
            )
          })}
        </div>
      </div>

      {/* Sites table */}
      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">
          Sites ({visibleSites.length})
        </h3>
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
          <div
            className={`grid ${siteColumns} gap-2 items-center px-3 py-2.5 border-b border-gray-100 bg-[#ECF2FA]`}
          >
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Incidents</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
            <span />
            <span />
          </div>
          {visibleSites.map((site) => (
            <SiteRow key={site.id} site={site} onOpenDashboard={onOpenDashboard} onSelectUnit={onSelectUnit} />
          ))}
        </div>
      </div>
    </>
  )
}