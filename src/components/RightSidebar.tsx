import { ChevronRight } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { MonitorAsset, MonitorTask } from '../data/assetMonitor'
import { IncidentPopup, type IncidentItem } from './IncidentPopup'
import { TaskDetailPopup } from './TasksPopup'

const priorityRows: Record<string, { row: string; high: number; medium: number; low: number }[]> = {
  all: [
    { row: 'New', high: 0, medium: 0, low: 0 },
    { row: 'In Progress', high: 41, medium: 33, low: 16 },
  ],
  incidents: [
    { row: 'New', high: 0, medium: 0, low: 0 },
    { row: 'In Progress', high: 9, medium: 6, low: 3 },
  ],
  tasks: [
    { row: 'New', high: 0, medium: 0, low: 0 },
    { row: 'In Progress', high: 32, medium: 27, low: 13 },
  ],
}

const priorityFilters = [
  { id: 'all', label: 'All', count: 90 },
  { id: 'incidents', label: 'Incidents', count: 18 },
  { id: 'tasks', label: 'Tasks', count: 72 },
]

const severityColor: Record<string, string> = {
  high: 'rgb(220, 18, 10)',
  medium: 'rgb(255, 147, 56)',
  low: 'rgb(255, 213, 66)',
}

interface Alert {
  type: 'Incident' | 'Task'
  title: string
  time: string
  severity: 'DEVIATION' | 'MEDIUM' | 'HIGH'
  severityColor: string
  unit?: string
  asset?: string
  equipment?: string
  tagLabel?: string
  tagValue?: string
  avatar?: string
}

const ALERT_SEVERITY: Record<Alert['severity'], { bg: string; fg: string }> = {
  HIGH: { bg: 'var(--status-critical-surface)', fg: 'var(--status-critical-text)' },
  MEDIUM: { bg: 'var(--status-warning-surface)', fg: 'var(--status-warning-text)' },
  DEVIATION: { bg: '#FFD542', fg: '#000' },
}

const deviationBadgeClass = (severity: Alert['severity']) =>
  severity === 'DEVIATION' ? 'theme-status-deviation-badge' : ''

const maskIcon = (src: string, color: string): CSSProperties => ({
  background: color,
  WebkitMaskImage: `url(${src})`,
  maskImage: `url(${src})`,
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
})

const alerts: Alert[] = [
  { type: 'Incident', title: 'BWRO Com Cartridge Filter 2 Anomaly', time: '22 Sep, 11:04 AM', severity: 'DEVIATION', severityColor: 'rgb(255, 193, 7)', unit: 'Mock Plant Unit 01', asset: 'BWRO Common 2', tagLabel: 'BWRO Cartridge Filter B Feed Flow', tagValue: '50.62' },
  { type: 'Incident', title: 'Mb 2-1 Anomaly', time: '22 Sep, 09:57 AM', severity: 'DEVIATION', severityColor: 'rgb(255, 193, 7)', unit: 'Mock Plant Unit 01', asset: 'Mix Bed 2', tagLabel: 'Mixed Bed B DM Flow TOTAL FLOW', tagValue: '152291.87' },
  { type: 'Task', title: 'High ORP in SWRO Feed (273.47)', time: '09:19 AM', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Mock Plant Unit 01', equipment: 'SWRO Skid A', avatar: 'RM' },
  { type: 'Task', title: 'Chemicals Data not entered on 21 September 2026', time: '12:00 AM', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Mock Plant Unit 01', equipment: 'Chemical Dosing Skid', avatar: 'AJ' },
  { type: 'Task', title: 'Opening stock is negative on 21 September 2026', time: '12:00 AM', severity: 'HIGH', severityColor: 'rgb(255, 46, 25)', unit: 'Mock Plant Unit 01', equipment: 'Chemical Store', avatar: 'PS' },
  { type: 'Task', title: 'SWRO Skid C High Feed Pressure (75.18)', time: '21 Sep, 2026', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Mock Plant Unit 01', equipment: 'SWRO Skid C', avatar: 'KV' },
  { type: 'Task', title: 'BWRO Common Low Feed Flow (6.88)', time: '21 Sep, 2026', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Mock Plant Unit 01', equipment: 'BWRO Common', avatar: 'NG' },
]

const dataTagOf = (label: string) => `${label.toUpperCase().replace(/[^A-Z0-9]+/g, '_')}_PV`

const incidentBadges = [
  { label: 'B', color: 'bg-green-100 text-green-700' },
  { label: 'E', color: 'bg-green-100 text-green-700' },
  { label: 'V', color: 'bg-green-100 text-green-700' },
  { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
]

const toIncidentItem = (a: Alert): IncidentItem => ({
  id: `priority-${a.title}`,
  time: a.time,
  title: a.title,
  source: a.asset ? `${a.unit} > ${a.asset}` : (a.unit ?? ''),
  kpiLabel: a.tagLabel ?? '',
  kpiValue: a.tagValue ?? '',
  kpiDelta: '',
  status: a.severity === 'HIGH' ? 'cr' : a.severity === 'MEDIUM' ? 'wr' : 'dv',
  severity: a.severity === 'DEVIATION' ? 'Warning' : 'Critical',
  openStatus: 'Open',
  startDate: a.time,
  unitName: a.unit ?? '',
  equipment: a.asset ?? a.unit ?? '',
  kpiName: a.tagLabel ?? a.title,
  dataTag: dataTagOf(a.tagLabel ?? a.title),
  value: a.tagValue ?? '',
  unit: '',
  timestamp: a.time,
  badges: incidentBadges,
})

const toMonitorAsset = (a: Alert): MonitorAsset => ({
  id: a.equipment ?? a.unit ?? a.title,
  name: a.equipment ?? a.unit ?? a.title,
  status: 'ar',
  risk: 0,
  riskLevel: 'Low',
  on: true,
  tasks: 1,
  height: 0,
  events: [],
})

const toMonitorTask = (a: Alert): MonitorTask => ({
  id: `priority-${a.title}`,
  assetId: a.equipment ?? a.unit ?? a.title,
  title: a.title,
  time: a.time,
  unit: a.unit ?? '',
  avatar: a.avatar ?? 'RM',
})

export default function RightSidebar({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState('all')
  const [openAlert, setOpenAlert] = useState<Alert | null>(null)

  return (
    <div className="w-[300px] shrink-0 border-l border-gray-200 bg-white flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
        <span className="text-[13px] font-bold text-gray-900">Priority Actions</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3.5" width="14" height="13" rx="2"></rect>
            <line x1="7.5" y1="3.5" x2="7.5" y2="16.5"></line>
            <path d="M13 7.5l-2.5 2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          {priorityFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                filter === f.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label} <b className={filter === f.id ? 'text-white' : 'text-gray-900'}>{f.count}</b>
            </button>
          ))}
        </div>
        <table className="w-full text-[11px]" style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="font-normal text-gray-400 text-center py-1"></th>
              <th className="font-normal text-gray-400 text-center py-1">High</th>
              <th className="font-normal text-gray-400 text-center py-1">Medium</th>
              <th className="font-normal text-gray-400 text-center py-1">Low</th>
            </tr>
          </thead>
          <tbody>
            {priorityRows[filter].map((r) => (
              <tr key={r.row}>
                <td className="text-right text-gray-400 text-[10px] py-1 pr-1">{r.row}</td>
                {(['high', 'medium', 'low'] as const).map((col) => (
                  <td
                    key={col}
                    className="text-center py-1.5 cursor-pointer font-normal"
                    style={{
                      background: severityColor[col],
                      color: col === 'high' ? '#fff' : '#111',
                      width: 65,
                      borderRadius: 2,
                    }}
                  >
                    {r[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 py-2 shrink-0">
          <span className="text-[12px] font-bold text-gray-900">Alerts and Recommendations</span>
        </div>
        <div className="pb-3">
          {alerts.map((a, i) => {
            const isIncident = a.type === 'Incident'
            const sev = ALERT_SEVERITY[a.severity]
            return (
              <div
                key={i}
                onClick={() => setOpenAlert(a)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setOpenAlert(a)
                }}
                className="px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      isIncident ? 'theme-status-critical-soft theme-status-critical-text' : 'theme-status-healthy-soft theme-status-healthy-text'
                    }`}
                  >
                    <span
                      className="w-[13px] h-[13px] shrink-0 transition-all opacity-70 group-hover:opacity-100"
                      style={maskIcon(isIncident ? '/incidents.svg' : '/Tasks.svg', isIncident ? 'var(--status-critical-text)' : 'var(--status-healthy-text)')}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    {isIncident && (
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-[10px] text-gray-400">{a.time}</div>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${deviationBadgeClass(a.severity)}`}
                          style={{ backgroundColor: sev.bg, color: sev.fg }}
                        >
                          {a.severity}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center">
                      <div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{a.title}</div>
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {isIncident ? (
                        <>
                          <span>{a.tagLabel}</span>
                          {a.tagValue && <span className="ml-1 text-amber-500 font-medium">{a.tagValue}</span>}
                        </>
                      ) : (
                        a.time
                      )}
                    </div>
                  </div>
                  {a.avatar && (
                    <span className="w-6 h-6 rounded-full bg-[#5B5FC7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{a.avatar}</span>
                  )}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
                </div>
                {(a.unit || a.asset) && (
                  <div className="mt-2">
                    <div className="text-[11px] text-gray-500 truncate">
                      <span>{a.unit}</span>
                      {a.asset && (
                        <span>
                          <span className="text-gray-400 mx-0.5">&gt;</span>
                          {a.asset}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {openAlert?.type === 'Incident' && (
        <IncidentPopup incident={toIncidentItem(openAlert)} onClose={() => setOpenAlert(null)} />
      )}
      {openAlert?.type === 'Task' && (
        <TaskDetailPopup
          task={toMonitorTask(openAlert)}
          asset={toMonitorAsset(openAlert)}
          onClose={() => setOpenAlert(null)}
        />
      )}
    </div>
  )
}
