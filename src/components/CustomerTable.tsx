import { ArrowRight, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import { hashSeed } from '../lib/vary'
import {
  customers,
  generateSites,
  type SiteStat,
  type UnitStat,
} from '../data/dashboard'

const columns = 'grid-cols-[minmax(220px,2fr)_1fr_1fr_1.2fr_1fr_1.4fr]'
const siteColumns = 'grid-cols-[24px_minmax(220px,2fr)_1fr_1fr_1.2fr_1fr_1.4fr]'

const STATUS_COLOR: Record<UnitStat['status'], string> = {
  healthy: '#0A6347',
  critical: '#C1292E',
  offline: '#C1292E',
}

const TH =
  'text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100'

function RingPlot({ value, color, size = 40 }: { value: number; color: string; size?: number }) {
  const stroke = Math.max(3, Math.round(size * 0.09))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, value))
  const offset = circumference * (1 - clamped / 100)
  const center = size / 2

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#E5E7EB" strokeWidth={stroke} />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        style={{ stroke: color }}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fontSize={Math.round(size * 0.26)}
        fontWeight="700"
        style={{ fill: color }}
      >
        {value}%
      </text>
    </svg>
  )
}

function LegendSquare({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-0.5" title={label}>
      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
      <span className="text-gray-900 text-[10px]">{value}</span>
    </div>
  )
}

function UnitTable({ units, onSelectUnit }: { units: UnitStat[]; onSelectUnit: (unitName: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 overflow-x-auto [&_th]:border-r [&_th]:border-gray-200 [&_td]:border-r [&_td]:border-gray-200 [&_th:last-child]:border-r-0 [&_td:last-child]:border-r-0">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-[#ECF2FA]">
            <th className={TH} style={{ paddingLeft: 15 }}>Units</th>
            <th className={TH}>Availability</th>
            <th className={TH}>Assets</th>
            <th className={TH}>Incidents</th>
            <th className={TH}>Tasks</th>
            <th className={TH}>Trips</th>
            <th className={TH}>PM Activity</th>
            <th className={TH}>Shutdown</th>
            <th className={TH} />
          </tr>
        </thead>
        <tbody className="bg-white">
          {units.map((unit, index) => {
            const color = STATUS_COLOR[unit.status]
            return (
              <tr
                key={unit.id}
                onClick={() => onSelectUnit(unit.name)}
                className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors last:border-b-0 cursor-pointer group/unit"
              >
                <td className="py-3 px-3 align-middle" style={{ paddingLeft: 15 }}>
                  <div className="flex items-center gap-2">
                    <span className="relative flex w-2.5 h-2.5 shrink-0">
                      {unit.status === 'healthy' && (
                        <span
                          className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping"
                          style={{ background: color }}
                        />
                      )}
                      <span
                        className="relative inline-flex w-2.5 h-2.5 rounded-full"
                        style={{ background: color }}
                      />
                    </span>
                    <div className="flex-1">
                      <div className="text-gray-900 text-sm group-hover/unit:text-blue-600 transition-colors">
                        {unit.name}
                      </div>
                      <div className="text-[11px] text-gray-500 font-medium">
                        {unit.status === 'offline' ? (
                          <span style={{ color: '#C1292E' }}>offline</span>
                        ) : (
                          <>Last update: {unit.updated}</>
                        )}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-middle">
                  <div className="flex items-center justify-center">
                    <RingPlot value={unit.health} color={color} />
                  </div>
                </td>
                <td className="py-3 px-3 text-center align-top">
                  <div className="flex flex-col items-center">
                    <span className="text-gray-900 text-base">{unit.assets.total}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap mt-1.5">
                      <LegendSquare color="var(--gm)" label="Healthy" value={unit.assets.healthy} />
                      <LegendSquare color="var(--rm)" label="Critical" value={unit.assets.critical} />
                      <LegendSquare color="#6b7280" label="Offline" value={unit.assets.offline} />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.incidents.total}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap mt-1.5">
                      <LegendSquare color="var(--rm)" label="Critical" value={unit.incidents.critical} />
                      <LegendSquare color="var(--am)" label="Warning" value={unit.incidents.warning} />
                      <LegendSquare color="#ffc107" label="Deviation" value={unit.incidents.deviation} />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.tasks.total}</span>
                    {unit.tasks.overdue > 0 ? (
                      <div className="whitespace-nowrap" style={{ color: 'var(--rm)' }}>
                        <span className="text-xs">{unit.tasks.overdue}</span>{' '}
                        <span className="text-[10px] font-medium">Overdue</span>
                      </div>
                    ) : index === 0 ? (
                      <div className="whitespace-nowrap" style={{ color: 'var(--am)' }}>
                        <span className="text-xs">1</span>{' '}
                        <span className="text-[10px] font-medium">Action required soon</span>
                      </div>
                    ) : (
                      <div
                        className="whitespace-nowrap text-[10px] font-medium"
                        style={{ color: 'var(--gm)' }}
                      >
                        No overdue tasks
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-3 px-3 align-top">
                  <div className="flex flex-col gap-0.5 items-center">
                    <span className="text-gray-900 text-base">{unit.trips.total}</span>
                    <div className="flex items-center gap-2 whitespace-nowrap mt-1.5">
                      <LegendSquare color="var(--gm)" label="Planned" value={unit.trips.planned} />
                      <LegendSquare color="var(--rm)" label="Unplanned" value={unit.trips.unplanned} />
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-gray-900 text-base align-top text-center">
                  {unit.pmActivity}
                </td>
                <td className="py-3 px-3 text-gray-900 text-base align-top text-center">
                  {unit.shutdown}
                </td>
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

function SitesHeadRow() {
  return (
    <div
      className={`grid ${siteColumns} gap-2 items-center px-4 py-2.5 border-b border-gray-100 bg-[#ECF2FA]`}
    >
      <span />
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Site</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
        Incidents
      </span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
      <span />
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
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        onClick={() => setOpen((o) => !o)}
        className={`grid ${siteColumns} gap-2 items-center px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer group/site`}
      >
        <div className="flex justify-start">
          <ChevronDown
            className={`w-4 h-4 text-gray-300 group-hover/site:text-blue-500 transition-all ${
              open ? 'rotate-180' : ''
            }`}
          />
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

        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onOpenDashboard(site.name)
            }}
            className="text-[#005EDB] text-sm font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#005EDB] hover:bg-[#005EDB] hover:text-white hover:shadow-md transition-all group-hover/site:bg-[#005EDB] group-hover/site:text-white group-hover/site:shadow-md"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-gray-100 bg-white p-2.5">
          <UnitTable units={site.unitList} onSelectUnit={(unitName) => onSelectUnit(site.name, unitName)} />
        </div>
      )}
    </div>
  )
}

export default function CustomerTable({
  active,
  onOpenDashboard,
  onSelectUnit,
  variant = '',
}: {
  active: string
  onOpenDashboard: (siteName: string) => void
  onSelectUnit: (siteName: string, unitName: string) => void
  variant?: string
}) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  if (active !== 'all') {
    const customer = customers.find((c) => c.id === active)
    const sites = customer ? generateSites(customer.id, variant) : []

    return (
      <div className="sites-table-wrap bg-white border border-gray-200 rounded-md overflow-hidden">
        <SitesHeadRow />
        {sites.map((site) => (
          <SiteRow key={site.id} site={site} onOpenDashboard={onOpenDashboard} onSelectUnit={onSelectUnit} />
        ))}
      </div>
    )
  }

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }))

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      <div
        className={`grid ${columns} gap-2 items-center px-4 py-2.5 border-b border-gray-100 bg-[#ECF2FA]`}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Customer
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Units</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Assets</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Incidents
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Tasks</span>
        <span className="text-right text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Action
        </span>
      </div>

      {customers.map((c) => {
        const isOpen = !!expanded[c.id]
        const sites = generateSites(c.id, variant)
        const siteTotals = sites.reduce(
          (acc, site) => {
            const unitList = site.unitList ?? []
            const offlineUnits = unitList.filter((u) => u.status === 'offline').length
            const assetCritical = site.assets.legends.find((l) => l.label === 'Critical')?.value ?? 0
            const assetAtRisk = site.assets.legends.find((l) => l.label === 'At Risk')?.value ?? 0
            const incidentCritical = site.incidents.legends.find((l) => l.label === 'Critical')?.value ?? 0
            const incidentWarning = site.incidents.legends.find((l) => l.label === 'Warning')?.value ?? 0
            const taskOverdue = site.tasks.legends.find((l) => l.label === 'Overdue')?.value ?? 0
            const taskNotStarted = site.tasks.legends.find((l) => l.label === 'Not Started')?.value ?? 0
            return {
              offlineUnits: acc.offlineUnits + offlineUnits,
              assetCritical: acc.assetCritical + assetCritical,
              assetAtRisk: acc.assetAtRisk + assetAtRisk,
              incidentCritical: acc.incidentCritical + incidentCritical,
              incidentWarning: acc.incidentWarning + incidentWarning,
              taskOverdue: acc.taskOverdue + taskOverdue,
              taskNotStarted: acc.taskNotStarted + taskNotStarted,
            }
          },
          { offlineUnits: 0, assetCritical: 0, assetAtRisk: 0, incidentCritical: 0, incidentWarning: 0, taskOverdue: 0, taskNotStarted: 0 },
        )
        const seed = hashSeed(c.id)
        const showUnitsAlert = seed % 3 !== 0
        const showAssetsAlert = (seed >> 2) % 3 !== 0
        const showIncidentsAlert = (seed >> 4) % 3 !== 0
        const showTasksAlert = (seed >> 6) % 3 !== 0
        return (
          <div key={c.id} className="border-b border-gray-100 last:border-b-0">
            <div
              onClick={() => toggle(c.id)}
              className={`grid ${columns} gap-2 items-center px-4 py-3 transition-colors hover:bg-gray-50 cursor-pointer group/site`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggle(c.id)
                  }}
                  className="p-0.5 text-gray-400 hover:text-gray-900 rounded transition-colors flex-shrink-0"
                  title={isOpen ? 'Collapse' : 'Expand'}
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${isOpen ? '' : '-rotate-90'}`}
                  />
                </button>
                <CustomerLogo customer={c} />
                <div className="min-w-0 text-left">
                  <div className="text-sm font-semibold text-gray-900 truncate">{c.name}</div>
                  <div className="text-xs text-gray-500">{c.sites} sites</div>
                </div>
              </div>

              <div>
                <span className="text-sm font-bold text-gray-900">{c.units}</span>
                {showUnitsAlert && siteTotals.offlineUnits > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.offlineUnits} offline</span>
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">{c.assets}</span>
                {showAssetsAlert && siteTotals.assetCritical > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.assetCritical} critical</span>
                )}
                {showAssetsAlert && siteTotals.assetCritical === 0 && siteTotals.assetAtRisk > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.assetAtRisk} at risk</span>
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">{c.incidents}</span>
                {showIncidentsAlert && siteTotals.incidentCritical > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.incidentCritical} critical</span>
                )}
                {showIncidentsAlert && siteTotals.incidentCritical === 0 && siteTotals.incidentWarning > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.incidentWarning} warning</span>
                )}
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900">{c.tasks}</span>
                {showTasksAlert && siteTotals.taskOverdue > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.taskOverdue} overdue</span>
                )}
                {showTasksAlert && siteTotals.taskOverdue === 0 && siteTotals.taskNotStarted > 0 && (
                  <span className="block text-[10px] text-[#dc3545] font-medium">{siteTotals.taskNotStarted} not started</span>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onOpenDashboard(sites[0]?.name ?? c.name)
                  }}
                  className="text-[#005EDB] text-sm font-semibold inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-[#005EDB] hover:bg-[#005EDB] hover:text-white hover:shadow-md transition-all group-hover/site:bg-[#005EDB] group-hover/site:text-white group-hover/site:shadow-md"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isOpen && (
              <div className="border-t border-gray-100 bg-white p-2.5">
                <table className="w-full border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-[#ECF2FA]">
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Site Name</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Assets</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Incidents</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Tasks</th>
                      <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {sites.map((site) => (
                      <tr key={site.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer group/site" onClick={() => onOpenDashboard(site.name)}>
                        <td className="py-3 px-3 text-left">
                          <div className="text-sm font-semibold text-gray-900">{site.name}</div>
                          <div className="text-xs text-gray-500">{site.units} units</div>
                        </td>
                        <td className="py-3 px-3 text-left">
                          <span className="text-sm font-bold text-gray-900">{site.assets.value}</span>
                          {site.assets.legends.find((l) => l.label === 'Critical' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.assets.legends.find((l) => l.label === 'Critical')!.value} critical</span>
                          ) : site.assets.legends.find((l) => l.label === 'At Risk' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.assets.legends.find((l) => l.label === 'At Risk')!.value} at risk</span>
                          ) : (
                            <span className="block text-[10px] text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-left">
                          <span className="text-sm font-bold text-gray-900">{site.incidents.value}</span>
                          {site.incidents.legends.find((l) => l.label === 'Critical' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.incidents.legends.find((l) => l.label === 'Critical')!.value} critical</span>
                          ) : site.incidents.legends.find((l) => l.label === 'Warning' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.incidents.legends.find((l) => l.label === 'Warning')!.value} warning</span>
                          ) : (
                            <span className="block text-[10px] text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-left">
                          <span className="text-sm font-bold text-gray-900">{site.tasks.value}</span>
                          {site.tasks.legends.find((l) => l.label === 'Overdue' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.tasks.legends.find((l) => l.label === 'Overdue')!.value} overdue</span>
                          ) : site.tasks.legends.find((l) => l.label === 'Not Started' && l.value > 0) ? (
                            <span className="block text-[10px] text-[#dc3545] font-medium">{site.tasks.legends.find((l) => l.label === 'Not Started')!.value} not started</span>
                          ) : (
                            <span className="block text-[10px] text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-left">
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover/site:text-blue-500 transition-colors" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
