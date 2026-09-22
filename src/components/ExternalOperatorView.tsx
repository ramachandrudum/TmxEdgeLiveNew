import {
  AlertTriangle,
  ArrowRight,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  Info,
  Wrench,
  CheckCircle2,
  Zap,
  Clock,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import { generateSites, type Customer, type SiteStat, type UnitStat } from '../data/dashboard'
import SummaryCards from './SummaryCards'
import SiteSummaryRow from './SiteSummaryRow'
import { hashSeed, seededRandom } from '../lib/vary'

type Props = {
  customer: Customer
  onOpenDashboard: (siteName: string) => void
  hideMetrics?: boolean
  variant?: string
}

const STATUS_COLOR: Record<UnitStat['status'], string> = {
  healthy: '#0A6347',
  critical: '#dc3545',
  offline: '#dc3545',
}

const recentActivity = [
  { id: 'ra1', kind: 'warn' as const, title: '10 new incidents in HVAC', sub: 'Vibration levels are beyond the acceptable threshold', path: ['Nestle UAE', 'HVAC'] },
  { id: 'ra2', kind: 'ok' as const, title: 'Chiller 10 preventive maintenance completed', sub: 'All tasks for August 2026 are completed', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 'ra3', kind: 'ok' as const, title: 'Chiller 10 preventive maintenance completed', sub: 'All tasks for August 2026 are completed', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 'ra4', kind: 'warn' as const, title: '10 new incidents in Compressor', sub: 'Vibration levels are beyond the acceptable threshold', path: ['Nestle UAE', 'Compressors'] },
  { id: 'ra5', kind: 'warn' as const, title: '10 new incidents in Compressor', sub: 'Vibration levels are beyond the acceptable threshold', path: ['Nestle UAE', 'Compressors'] },
]

const lastViewed = [
  { id: 'lv1', type: 'asset' as const, time: null as string | null, title: 'Chiller 10', sub: 'Risk Score : 89.6% ▲ 10%', avatar: null as string | null, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'lv2', type: 'incident' as const, time: '02/08/2026, 9:00 am', title: 'Compressor Specific Power High', sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%', avatar: null, path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 'lv3', type: 'task' as const, time: null, title: 'Inspect Cooling Tower Fans', sub: 'Overdue by : 1d 4h', avatar: 'AJ', path: ['Nestle UAE', 'HVAC', 'Cooling Tower A'] },
  { id: 'lv4', type: 'incident' as const, time: '02/08/2026, 9:00 am', title: 'Compressor Specific Power High', sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%', avatar: null, path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
]

const quickLinks = [
  { id: 'ql1', title: 'Logbook', desc: 'View all the shift handover information logged by operators on-site' },
  { id: 'ql2', title: 'Asset Monitor', desc: 'View real-time health and risk trends for every monitored asset' },
  { id: 'ql3', title: 'Consumption Reports', desc: 'View power, thermal, and water consumption reports across all sites' },
  { id: 'ql4', title: 'Tags', desc: 'View and manage asset tags across all sites and monitored units' },
  { id: 'ql5', title: 'Service History', desc: 'View past maintenance visits and completed work orders across all sites' },
]

const baseMetrics = [
  { num: 46, label: 'Avg Risk Score', caption: 'Across all assets, fleet-wide', icon: Zap, bg: '#FFF3E0', color: '#E65100' },
  { num: 16, label: 'Critical Asset Ratio', caption: 'Share of assets in critical state', icon: AlertTriangle, bg: '#FFEBEE', color: '#dc3545' },
  { num: 33, label: 'Task Completion Rate', caption: 'Of all tasks raised, fleet-wide', icon: CheckCircle, bg: '#E8F5E9', color: '#2E7D32' },
  { num: 50, label: 'On-Time Task Rate', caption: 'Not overdue, fleet-wide', icon: Clock, bg: '#E3F2FD', color: '#1565C0' },
]

const siteColumns = 'grid-cols-[24px_minmax(220px,2fr)_1fr_1fr_1.2fr_1fr_1.4fr]'

function AvailabilityGauge({ percent, color }: { percent: number; color: string }) {
  const r = 18
  const circumference = 2 * Math.PI * r
  const offset = circumference - (percent / 100) * circumference
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" className="shrink-0">
      <circle cx="20" cy="20" r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <circle cx="20" cy="20" r={r} fill="none" strokeWidth="4" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90 20 20)" style={{ stroke: color }} />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="10" fontWeight="700" style={{ fill: color }}>{percent}%</text>
    </svg>
  )
}

function UnitTable({ units, summary }: { units: UnitStat[]; summary?: SiteStat }) {
  return (
    <div className="bg-white border border-gray-200 overflow-x-auto [&_th]:border-r [&_th]:border-gray-200 [&_td]:border-r [&_td]:border-gray-200 [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#ECF2FA]">
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100" style={{ paddingLeft: 50 }}>Units</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Availability</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Assets</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Incidents</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Tasks</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Trips</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">PM Activity</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Shutdown</th>
            <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 w-[35px]"></th>
          </tr>
        </thead>
        <tbody className="bg-white">
          {summary && <SiteSummaryRow site={summary} />}
          {units.map((unit) => {
            const color = STATUS_COLOR[unit.status]
            const isOffline = unit.status === 'offline'
            const healthColor = isOffline ? '#dc3545' : '#0A6347'
            const healthPercent = isOffline ? 0 : unit.health
            return (
              <tr key={unit.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors last:border-b-0 cursor-pointer group/unit">
                <td className="py-3 px-3 align-middle" style={{ paddingLeft: 50 }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex w-2.5 h-2.5 shrink-0">
                      {!isOffline && <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" style={{ background: color }} />}
                      <span className="relative inline-flex w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                    </span>
                    <div className="flex-1">
                      <div className="text-gray-900 text-sm group-hover/unit:text-blue-600 transition-colors">{unit.name}</div>
                      <div className="text-[11px] text-gray-500 font-medium">{isOffline ? <span style={{ color }}>offline</span> : `Last update: ${unit.updated}`}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-middle">
                  <div className="flex items-center justify-center">
                    <AvailabilityGauge percent={healthPercent} color={healthColor} />
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-900 text-base align-top text-center">{unit.assets.total}</td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.incidents.total}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap mt-1.5">
                      <div className="flex items-center gap-0.5" title="Critical"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--rm)' }} /><span className="text-gray-900 text-[10px]">{unit.incidents.critical}</span></div>
                      <div className="flex items-center gap-0.5" title="Warning"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--am)' }} /><span className="text-gray-900 text-[10px]">{unit.incidents.warning}</span></div>
                      <div className="flex items-center gap-0.5" title="Deviation"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'rgb(255, 193, 7)' }} /><span className="text-gray-900 text-[10px]">{unit.incidents.deviation}</span></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.tasks.total}</span>
                    {unit.tasks.overdue > 0 ? <div className="whitespace-nowrap" style={{ color: 'var(--rm)' }}><span className="text-xs">{unit.tasks.overdue}</span> <span className="text-[10px] font-medium">Overdue</span></div> : unit.tasks.open > 0 ? <div className="whitespace-nowrap" style={{ color: 'var(--am)' }}><span className="text-xs">{unit.tasks.open}</span> <span className="text-[10px] font-medium">Action required soon</span></div> : null}
                  </div>
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.trips.total}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap mt-1.5">
                      <div className="flex items-center gap-0.5" title="Planned"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gm)' }} /><span className="text-gray-900 text-[10px]">{unit.trips.planned}</span></div>
                      <div className="flex items-center gap-0.5" title="Unplanned"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--rm)' }} /><span className="text-gray-900 text-[10px]">{unit.trips.unplanned}</span></div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-900 text-base align-top text-center">{unit.pmActivity}</td>
                <td className="py-3 px-3 text-gray-900 text-base align-top text-center">{unit.shutdown}</td>
                <td className="py-3 px-3 align-middle">
                  <span className="relative flex items-center justify-center w-8 h-8">
                    <span className="absolute inset-0 rounded-full bg-blue-500/30 opacity-0 group-hover/unit:animate-ping" />
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover/unit:text-blue-600 transition-colors" />
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default function ExternalOperatorView({ customer, onOpenDashboard, hideMetrics, variant = '' }: Props) {
  const sites = generateSites(customer.id, variant)
  const [activeSite, setActiveSite] = useState<string>('all')
  const [openSites, setOpenSites] = useState<Set<string>>(new Set())

  const metrics = useMemo(() => {
    const rnd = seededRandom(hashSeed(`ext-${customer.id}-${variant}`))
    return baseMetrics.map((m) => ({
      ...m,
      num: `${Math.max(3, Math.round(m.num * (0.75 + rnd() * 0.5)))}%`,
    }))
  }, [customer.id, variant])

  const visibleSites = activeSite === 'all' ? sites : sites.filter((s) => s.name === activeSite)

  const toggleSite = (siteId: string) => {
    setOpenSites((prev) => {
      const next = new Set(prev)
      if (next.has(siteId)) {
        next.delete(siteId)
      } else {
        next.add(siteId)
      }
      return next
    })
  }

  return (
    <>
      <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-gray-200 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-50 text-blue-600 shrink-0">
            <Building2 className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">{customer.name}</h2>
            <div className="text-xs text-gray-500 font-medium mt-0.5">{customer.sites} sites · {customer.units} units ({activeSite === 'all' ? 'All Sites' : activeSite})</div>
          </div>
        </div>
        <button onClick={() => onOpenDashboard(sites[0]?.name ?? '')} className="btn btn-md text-[#005EDB] border border-[#005EDB]/25 hover:bg-[#005EDB] hover:text-white hover:shadow-md">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <button onClick={() => setActiveSite('all')} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeSite === 'all' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>All Sites</button>
        {sites.map((s) => (
          <button key={s.id} onClick={() => setActiveSite(s.name)} className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${activeSite === s.name ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s.name}</button>
        ))}
      </div>

      <SummaryCards active={customer.id} variant={variant} />

      {hideMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-800">Recent Activity</div>
            <div>
              {recentActivity.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2.5 cursor-pointer group">
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.kind === 'warn' ? 'bg-[#FFF3E0] text-[#E65100]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                      {item.kind === 'warn' ? <Info className="w-3.5 h-3.5" strokeWidth={1.8} /> : <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</div>
                      <div className="text-[11px] text-gray-500 truncate">{item.sub}</div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                  <div className="mt-2"><div className="text-[11px] text-gray-500 truncate">{item.path.map((p, i) => <span key={i}>{i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}{p}</span>)}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-800">Last Viewed</div>
            <div>
              {lastViewed.map((item) => (
                <div key={item.id} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-2.5 cursor-pointer group">
                    <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.type === 'asset' ? 'bg-[#E3F2FD] text-[#1565C0]' : item.type === 'incident' ? 'bg-[#FFEBEE] text-[#dc3545]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                      {item.type === 'asset' ? <Wrench className="w-3.5 h-3.5" strokeWidth={1.8} /> : item.type === 'incident' ? <AlertTriangle className="w-3.5 h-3.5" strokeWidth={1.8} /> : <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={1.8} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      {item.time && <div className="text-[10px] text-gray-400">{item.time}</div>}
                      <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#dc3545] shrink-0" /><div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</div></div>
                      <div className="text-[11px] text-gray-500 truncate">{item.sub}</div>
                    </div>
                    {item.avatar && <span className="w-6 h-6 rounded-full bg-[#5B5FC7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{item.avatar}</span>}
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                  </div>
                  <div className="mt-2"><div className="text-[11px] text-gray-500 truncate">{item.path.map((p, i) => <span key={i}>{i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}{p}</span>)}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <button key={link.id} className="flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-md text-left hover:border-blue-200 hover:shadow-sm transition-all cursor-pointer group">
                <span className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><ClipboardList className="w-4 h-4" strokeWidth={1.8} /></span>
                <span className="flex-1 min-w-0"><span className="block text-[13px] font-semibold text-gray-900">{link.title}</span><span className="block text-[11px] text-gray-500">{link.desc}</span></span>
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {!hideMetrics && (
        <div style={{ marginTop: 28 }} className="mb-4">
          <div className="text-sm font-bold text-gray-800 mb-3">Performance Metrics</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((m) => {
              const Icon = m.icon
              return (
                <div key={m.label} className="bg-white border border-gray-200 rounded-md px-2 py-[5px] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: m.bg, color: m.color }}>
                    <Icon className="w-[15px] h-[15px]" strokeWidth={1.7} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-gray-900">{m.num}</span>
                      <span className="text-xs text-gray-900 font-semibold">{m.label}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">{m.caption}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-gray-800 mb-3">Sites ({visibleSites.length})</h3>
        <div className="sites-table-wrap bg-white border border-gray-200 rounded-md overflow-hidden">
          <div className={`grid ${siteColumns} gap-2 items-center px-4 py-2.5 border-b border-gray-100 bg-[#ECF2FA]`}>
            <span />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Incidents</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
            <span />
          </div>
          {visibleSites.map((site) => {
            const isOpen = openSites.has(site.id)
            const totals = site.unitList.reduce((acc, unit) => ({ assets: acc.assets + unit.assets.total, incidents: acc.incidents + unit.incidents.total, tasks: acc.tasks + unit.tasks.total }), { assets: 0, incidents: 0, tasks: 0 })
            const seed = hashSeed(site.id)
            const showUnitsAlert = seed % 3 !== 0
            const showAssetsAlert = (seed >> 2) % 3 !== 0
            const showIncidentsAlert = (seed >> 4) % 3 !== 0
            const showTasksAlert = (seed >> 6) % 3 !== 0
            const offlineUnits = site.unitList.filter((u) => u.status === 'offline').length
            const assetCritical = site.assets.legends.find((l) => l.label === 'Critical')?.value ?? 0
            const assetAtRisk = site.assets.legends.find((l) => l.label === 'At Risk')?.value ?? 0
            const incidentCritical = site.incidents.legends.find((l) => l.label === 'Critical')?.value ?? 0
            const incidentWarning = site.incidents.legends.find((l) => l.label === 'Warning')?.value ?? 0
            const taskOverdue = site.tasks.legends.find((l) => l.label === 'Overdue')?.value ?? 0
            const taskNotStarted = site.tasks.legends.find((l) => l.label === 'Not Started')?.value ?? 0
            return (
              <div key={site.id} className="border-b border-gray-100 last:border-b-0">
                <div
                  onClick={() => toggleSite(site.id)}
                  className={`grid ${siteColumns} gap-2 items-center px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer group/site`}
                >
                  <div className="flex justify-start">
                    <ChevronDown className={`w-4 h-4 text-gray-300 group-hover/site:text-blue-500 transition-transform ${isOpen ? '' : '-rotate-90'}`} />
                  </div>
                  <div className="min-w-0 max-w-[180px]">
                    <div className="text-sm font-semibold text-gray-900 truncate">{site.name}</div>
                    <div className="text-xs text-gray-500">Last updated {site.updated}</div>
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">{site.units}</span>
                    {showUnitsAlert && offlineUnits > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{offlineUnits} offline</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">{totals.assets}</span>
                    {showAssetsAlert && assetCritical > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{assetCritical} critical</span>
                    )}
                    {showAssetsAlert && assetCritical === 0 && assetAtRisk > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{assetAtRisk} at risk</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">{totals.incidents}</span>
                    {showIncidentsAlert && incidentCritical > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{incidentCritical} critical</span>
                    )}
                    {showIncidentsAlert && incidentCritical === 0 && incidentWarning > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{incidentWarning} warning</span>
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-gray-900">{totals.tasks}</span>
                    {showTasksAlert && taskOverdue > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{taskOverdue} overdue</span>
                    )}
                    {showTasksAlert && taskOverdue === 0 && taskNotStarted > 0 && (
                      <span className="block text-[10px] text-[#dc3545] font-medium">{taskNotStarted} not started</span>
                    )}
                  </div>
                  <div className="flex justify-end w-[35px]">
                    <button onClick={(e) => { e.stopPropagation(); onOpenDashboard(site.name) }} className="text-[#005EDB] text-sm font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#005EDB] hover:bg-[#005EDB] hover:text-white hover:shadow-md transition-all group-hover/site:bg-[#005EDB] group-hover/site:text-white group-hover/site:shadow-md">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {isOpen && (
                  <div className="border-t border-gray-100 bg-white p-2.5">
                    <UnitTable units={site.unitList} summary={site} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
