import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  MapPin,
  PenLine,
  Plus,
  Search,
  TriangleAlert,
  Wrench,
  X,
} from 'lucide-react'
import React, { useState } from 'react'
import {
  DOT_COLOR,
  TREND_PATH,
  TREND_X,
  TREND_Y,
  hierarchy,
  kpiStatus,
  kpis,
  otherSites,
  type NodeStatus,
  type TreeNode,
} from '../data/dashboardPage'
import AssetOverview from './AssetOverview'
import RightSidebar from './RightSidebar'

type Props = {
  siteName: string
  selectedUnitPath?: string[]
  onSelectSite?: (siteName: string) => void
}

const TABS = ['Overview', 'Process Flow', 'Attachments', 'Tags', 'Asset Timeline', 'Dashboard']

function Dot({ status, size = 8 }: { status: NodeStatus; size?: number }) {
  return (
    <span
      className="rounded-full shrink-0 inline-block"
      style={{ width: size, height: size, background: DOT_COLOR[status] }}
    />
  )
}

function TreeBranch({
  node,
  depth,
  expanded,
  onToggle,
  path,
  onSelect,
  selectedPath,
  onShowTooltip,
  onHideTooltip,
}: {
  node: TreeNode
  depth: number
  expanded: Record<string, boolean>
  onToggle: (id: string) => void
  path: string[]
  onSelect: (path: string[]) => void
  selectedPath: string[]
  onShowTooltip: (text: string, el: HTMLElement) => void
  onHideTooltip: () => void
}) {
  const hasKids = !!node.children && node.children.length > 0
  const open = !!expanded[node.id]
  const pad = 4 + depth * 10
  const currentPath = [...path, node.name]
  const isActive = selectedPath.length === currentPath.length && selectedPath.every((s, i) => s === currentPath[i])

  if (node.kind === 'asset') {
    return (
      <div
        onClick={() => onSelect(currentPath)}
        className={`group flex items-center gap-2 py-1.5 pr-2 rounded-md text-[13px] cursor-pointer ${
          isActive
            ? 'text-blue-700 font-semibold bg-blue-50'
            : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: pad, color: isActive ? undefined : '#364153' }}
        onMouseEnter={(e) => onShowTooltip(node.name, e.currentTarget)}
        onMouseLeave={onHideTooltip}
      >
        <Dot status={node.status ?? 'off'} />
        <span className="relative flex-1 min-w-0">
          <span className="block truncate">{node.name}</span>
        </span>
        <span className="opacity-0 group-hover:opacity-100 text-gray-400 text-lg leading-none">⋮</span>
      </div>
    )
  }

  return (
    <div>
      <div
        className={`group flex items-center gap-2 py-1.5 pr-2 rounded-md text-[13px] ${
          isActive
            ? 'text-blue-700 font-semibold'
            : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: node.kind === 'system' ? 35 : pad, color: isActive ? undefined : '#364153' }}
        onMouseEnter={(e) => onShowTooltip(node.name, e.currentTarget)}
        onMouseLeave={onHideTooltip}
      >
        {node.kind !== 'system' ? (
          <span
            onClick={() => hasKids && onToggle(node.id)}
            className={`shrink-0 ${hasKids ? 'cursor-pointer' : ''}`}
          >
            <ChevronRight
              className={`w-3 h-3 text-gray-400 transition-transform ${
                hasKids ? (open ? 'rotate-90' : '') : 'opacity-0'
              }`}
            />
          </span>
        ) : null}
        <span
          onClick={() => onSelect(currentPath)}
          className={`flex-1 min-w-0 cursor-pointer ${node.kind === 'system' ? 'font-semibold' : ''}`}
          style={node.kind === 'system' ? { color: '#364153', fontSize: 10 } : undefined}
        >
          <span className={`block truncate ${node.kind === 'system' ? 'uppercase' : ''}`}>{node.name}</span>
        </span>
        <span className="opacity-0 group-hover:opacity-100 text-gray-400 text-lg leading-none">⋮</span>
      </div>
      {hasKids && open && (
        <div>
          {node.children!.map((c) => (
            <TreeBranch key={c.id} node={c} depth={depth + 1} expanded={expanded} onToggle={onToggle} path={currentPath} onSelect={onSelect} selectedPath={selectedPath} onShowTooltip={onShowTooltip} onHideTooltip={onHideTooltip} />
          ))}
        </div>
      )}
    </div>
  )
}

function HierarchyPanel({ siteName, onSelect, selectedUnitPath, selectedPath, collapsed, setCollapsed }: { siteName: string; onSelect: (path: string[]) => void; selectedUnitPath?: string[]; selectedPath: string[]; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    HVAC: true,
    Compressors: true,
    pcs: true,
    scs: true,
    cs1: true,
    cs2: true,
  })
  const [query, setQuery] = useState('')

  const toggle = (id: string) => setExpanded((e) => ({ ...e, [id]: !e[id] }))

  const findExpandIds = (nodes: TreeNode[], path: string[], depth: number): string[] => {
    for (const node of nodes) {
      if (node.name === path[depth]) {
        if (depth < path.length - 1 && node.children) {
          return [node.id, ...findExpandIds(node.children, path, depth + 1)]
        }
        return [node.id]
      }
    }
    return []
  }

  if (selectedUnitPath && selectedUnitPath.length > 1) {
    const idsToExpand = findExpandIds(hierarchy.children || [], selectedUnitPath.slice(1), 0)
    if (idsToExpand.length > 0) {
      const newExpanded = { ...expanded }
      idsToExpand.forEach((id) => { newExpanded[id] = true })
      if (JSON.stringify(newExpanded) !== JSON.stringify(expanded)) {
        setExpanded(newExpanded)
      }
    }
  }

  if (collapsed) {
    return null
  }

  return (
    <aside className="w-[210px] shrink-0 border-r border-gray-200 bg-[#F9FAFC] flex flex-col min-h-0">
      <div className="h-11 flex items-center gap-2 px-3 border-b border-gray-100 shrink-0">
        <span className="text-[13px] font-bold text-gray-800 flex-1">Asset hierarchy</span>
        <button onClick={() => setCollapsed(true)} className="rp-collapse-btn" title="Collapse">
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3.5" width="14" height="13" rx="2" />
            <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
            <path d="M13 7.5l-2.5 2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="px-3 pt-3 shrink-0">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hierarchy"
            className="flex-1 bg-transparent outline-none text-[12px] text-gray-700 placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="px-3 py-3 relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          title={siteName}
          className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-200 bg-[#F8FAFC] hover:bg-gray-100 transition"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="flex-1 text-left text-[12px] font-semibold text-gray-800 truncate">
            {siteName}
          </span>
          <ChevronsUpDown className="w-3 h-3 text-gray-400 shrink-0" />
        </button>
        {menuOpen && (
          <div className="absolute left-3 right-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl py-1 z-30">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Other sites
            </div>
            {otherSites.map((s) => (
              <div
                key={s}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-2 pb-3">
        <div
          onClick={() => onSelect([hierarchy.name])}
          className={`flex items-center gap-2 py-1.5 px-2 rounded-md text-[13px] cursor-pointer ${
            selectedPath.length === 1
              ? 'font-semibold text-blue-700 bg-blue-50'
              : 'font-semibold text-gray-700 hover:bg-gray-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="flex-1 truncate">{hierarchy.name}</span>
        </div>
        {hierarchy.children!.map((unit) => (
          <TreeBranch
            key={unit.id}
            node={unit}
            depth={1}
            expanded={expanded}
            onToggle={toggle}
            path={[hierarchy.name]}
            onSelect={onSelect}
            selectedPath={selectedPath}
            onShowTooltip={(text, el) => {
              const r = el.getBoundingClientRect()
              setTooltip({ text, x: r.right + 12, y: r.top + r.height / 2 })
            }}
            onHideTooltip={() => setTooltip(null)}
          />
        ))}
        {query && (
          <div className="px-2 pt-2 text-[10px] text-gray-400">Filtering: “{query}”</div>
        )}
      </div>

      {tooltip && (
        <div
          className="pointer-events-none fixed z-[999] px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap flex items-center"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translateY(-50%)' }}
        >
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="absolute -left-1.5 top-1/2 -translate-y-1/2">
            <path d="M7 1L1 6L7 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {tooltip.text}
        </div>
      )}
    </aside>
  )
}

type IncidentItem = {
  id: string
  time: string
  title: string
  source: string
  kpiLabel: string
  kpiValue: string
  kpiDelta: string
  status: 'cr' | 'wr' | 'dv'
  cause?: string
  severity: 'Critical' | 'Warning'
  openStatus: 'Open' | 'Acknowledged' | 'Resolved'
  startDate: string
  unitName: string
  equipment: string
  kpiName: string
  dataTag: string
  value: string
  unit: string
  timestamp: string
  badges: { label: string; color: string }[]
}

type IncidentPopupData = {
  title: string
  incidents: IncidentItem[]
}

const incidentPopupData: Record<string, IncidentPopupData> = {
  'Condenser Approach High': {
    title: 'Condenser Approach High',
    incidents: [
      {
        id: 'inc1', time: '15/06, 2PM', title: 'Condenser Approach High', source: 'Chiller 10 (HVAC)',
        kpiLabel: 'Compressor Load', kpiValue: '104 TPH', kpiDelta: '↓10%', status: 'cr',
        cause: 'Fouled condenser tubes or reduced condenser water flow. Clean condenser tubes and verify cooling water flow rate.',
        severity: 'Critical', openStatus: 'Open', startDate: '21 Sep, 08:04 AM',
        unitName: 'MSB', equipment: 'COMPRESSOR 19-KA-RP-101B',
        kpiName: 'NHT_RGC_B_Rod_Drop_CYL_2', dataTag: 'BPBR1_19ZI4906.PV',
        value: '0.166', unit: 'mm', timestamp: '21/Sep 10:30 am',
        badges: [
          { label: 'B', color: 'bg-green-100 text-green-700' },
          { label: 'E', color: 'bg-green-100 text-green-700' },
          { label: 'V', color: 'bg-green-100 text-green-700' },
          { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
        ],
      },
      {
        id: 'inc2', time: '15/06, 1PM', title: 'Specific Power High', source: 'Chiller 10 (HVAC)',
        kpiLabel: 'Energy Cost', kpiValue: '+12%', kpiDelta: '↑12%', status: 'cr',
        cause: 'Reduced compressor efficiency or refrigerant undercharge. Check refrigerant charge and inspect compressor valves.',
        severity: 'Critical', openStatus: 'Open', startDate: '21 Sep, 09:15 AM',
        unitName: 'LSB', equipment: 'COMPRESSOR 19-KA-RP-101A',
        kpiName: 'NHT_RGC_A_Rod_Drop_CYL_1', dataTag: 'BPBR1_19ZI4901.PV',
        value: '0.142', unit: 'mm', timestamp: '21/Sep 10:45 am',
        badges: [
          { label: 'B', color: 'bg-green-100 text-green-700' },
          { label: 'E', color: 'bg-green-100 text-green-700' },
          { label: 'V', color: 'bg-green-100 text-green-700' },
          { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
        ],
      },
      {
        id: 'inc3', time: '09/06, 5AM', title: 'Evaporator ΔT Deviation', source: 'Chiller 10 (HVAC)',
        kpiLabel: 'Evaporator ΔT', kpiValue: '3.2 °C', kpiDelta: '↓12%', status: 'dv',
        severity: 'Warning', openStatus: 'Acknowledged', startDate: '09 Sep, 05:00 AM',
        unitName: 'MSB', equipment: 'CHILLER 19-KA-CH-101',
        kpiName: 'Evap_Delta_T', dataTag: 'EDT_CH101_PV',
        value: '3.2', unit: '°C', timestamp: '09/Sep 05:30 am',
        badges: [
          { label: 'B', color: 'bg-green-100 text-green-700' },
          { label: 'E', color: 'bg-green-100 text-green-700' },
          { label: 'V', color: 'bg-green-100 text-green-700' },
          { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
        ],
      },
    ],
  },
  'Specific Power High': {
    title: 'Specific Power High',
    incidents: [
      {
        id: 'inc4', time: '15/06, 2PM', title: 'Condenser Approach High', source: 'Chiller 10 (HVAC)',
        kpiLabel: 'Compressor Load', kpiValue: '104 TPH', kpiDelta: '↓10%', status: 'cr',
        cause: 'Fouled condenser tubes or reduced condenser water flow. Clean condenser tubes and verify cooling water flow rate.',
        severity: 'Critical', openStatus: 'Open', startDate: '21 Sep, 08:04 AM',
        unitName: 'MSB', equipment: 'COMPRESSOR 19-KA-RP-101B',
        kpiName: 'NHT_RGC_B_Rod_Drop_CYL_2', dataTag: 'BPBR1_19ZI4906.PV',
        value: '0.166', unit: 'mm', timestamp: '21/Sep 10:30 am',
        badges: [
          { label: 'B', color: 'bg-green-100 text-green-700' },
          { label: 'E', color: 'bg-green-100 text-green-700' },
          { label: 'V', color: 'bg-green-100 text-green-700' },
          { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
        ],
      },
      {
        id: 'inc5', time: '15/06, 1PM', title: 'Specific Power High', source: 'Chiller 10 (HVAC)',
        kpiLabel: 'Energy Cost', kpiValue: '+12%', kpiDelta: '↑12%', status: 'cr',
        cause: 'Reduced compressor efficiency or refrigerant undercharge. Check refrigerant charge and inspect compressor valves.',
        severity: 'Critical', openStatus: 'Open', startDate: '21 Sep, 07:30 AM',
        unitName: 'MSB', equipment: 'CHILLER 19-KA-CH-101',
        kpiName: 'Specific_Power_Chiller_101', dataTag: 'SP_CH101_PV',
        value: '0.892', unit: 'kW/TR', timestamp: '21/Sep 10:15 am',
        badges: [
          { label: 'B', color: 'bg-green-100 text-green-700' },
          { label: 'E', color: 'bg-green-100 text-green-700' },
          { label: 'V', color: 'bg-green-100 text-green-700' },
          { label: 'H', color: 'bg-yellow-100 text-yellow-700' },
        ],
      },
    ],
  },
}

const STATUS_DOT: Record<string, string> = { cr: 'bg-red-500', wr: 'bg-amber-500', dv: 'bg-yellow-400' }

function KpiIncidentsList({ kpiName, onSelectIncident, onClose }: { kpiName: string; onSelectIncident: (item: IncidentItem) => void; onClose: () => void }) {
  const data = incidentPopupData[kpiName]
  if (!data) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-[15px] font-bold text-gray-900">{data.title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {data.incidents.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectIncident(item)}
              className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer group"
            >
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-400 mb-1">{item.time}</div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${STATUS_DOT[item.status]}`} />
                  <span className="text-[13px] font-semibold text-gray-900">{item.title}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-[12px] text-gray-500">{item.source}</span>
                </div>
                <div className="text-[12px] text-gray-600 mt-1">
                  {item.kpiLabel} : <b className="text-gray-900">{item.kpiValue}</b>{' '}
                  <span className="text-red-500">{item.kpiDelta}</span>
                </div>
                {item.cause && (
                  <div className="mt-2 text-[11px] text-gray-500">
                    <div className="font-semibold text-gray-600 mb-0.5">Root Causes and Recommended Actions</div>
                    <div>{item.cause}</div>
                  </div>
                )}
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function IncidentPopup({ incident, onBack, onClose }: { incident: IncidentItem; onBack: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[800px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 pt-4 pb-3 border-b border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer shrink-0" title="Back to incidents">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-[15px] font-bold text-gray-900 truncate">{incident.unitName} - {incident.title}</span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="py-0.5 px-2 rounded text-[11px] font-semibold bg-red-100 text-red-700">{incident.severity}</span>
              <span className="py-0.5 px-2 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">{incident.openStatus}</span>
              <span className="text-[12px] text-gray-400">Start Date: <span className="font-semibold text-gray-700">{incident.startDate}</span></span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                Approve
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" /></svg>
                Pin
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                Flag Noise
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                Assign
              </button>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0 space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden text-[13px]">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2 font-bold bg-[#E7EDF6] w-[130px] text-gray-700">Unit Name</td>
                  <td className="px-3 py-2 bg-[#E7EDF6] text-gray-900">{incident.unitName}</td>
                  <td className="px-3 py-2 font-bold bg-[#E7EDF6] w-[180px] text-gray-700">Equipment</td>
                  <td className="px-3 py-2 bg-[#E7EDF6] text-gray-900">{incident.equipment}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-gray-700">KPI</td>
                  <td colSpan={3} className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-gray-900 truncate">{incident.kpiName}</div>
                        <div className="text-[12px] text-gray-500 truncate">{incident.dataTag}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[13px] font-bold text-gray-900">{incident.value} <span className="text-[11px] font-normal text-gray-400">{incident.unit}</span></div>
                          <div className="text-[11px] text-gray-400">{incident.timestamp}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {incident.badges.map((b, i) => (
                            <span key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${b.color}`}>{b.label}</span>
                          ))}
        </div>
      </div>
    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <span className="text-[13px] font-bold text-gray-800">Deviations</span>
            </div>
            <div className="p-3">
              <div className="h-[200px] bg-white rounded border border-gray-100 overflow-hidden">
                <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full block">
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#dc3545" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="#e5e7eb" strokeWidth="1" />
                  <polyline
                    fill="none"
                    stroke="#BD4F5B"
                    strokeWidth="2"
                    points="0,150 30,145 60,148 90,140 120,142 150,130 180,135 210,120 240,125 270,110 300,115 330,105 360,108 390,95 420,100 450,90 480,85 510,80 540,75 570,70 600,65"
                  />
                  <polyline
                    fill="none"
                    stroke="#000"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    points="0,120 30,118 60,122 90,115 120,118 150,110 180,112 210,105 240,108 270,100 300,102 330,95 360,98 390,90 420,92 450,85 480,82 510,78 540,75 570,70 600,68"
                    opacity="0.6"
                  />
                  <rect x="0" y="130" width="600" height="30" fill="rgb(251,177,74)" fillOpacity="0.3" />
                  <text x="5" y="15" fontSize="10" fill="#6b7280">mm</text>
                  <text x="570" y="15" fontSize="10" fill="#6b7280">Kg/cm²</text>
                  <text x="100" y="195" fontSize="9" fill="#9ca3af">08:30</text>
                  <text x="250" y="195" fontSize="9" fill="#9ca3af">09:30</text>
                  <text x="400" y="195" fontSize="9" fill="#9ca3af">10:00</text>
                  <text x="530" y="195" fontSize="9" fill="#9ca3af">10:30</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600 text-blue-600 text-[13px] font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            More Details
          </button>
        </div>
      </div>
    </div>
  )
}

function KpiStatusCard({ onKpiClick }: { onKpiClick: (name: string) => void }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col h-[240px] min-h-0">
      <div className="text-[13px] font-bold text-gray-800">KPI Status ({kpiStatus.total})</div>
      <div className="flex h-2 rounded-full overflow-hidden mt-3">
        <span style={{ width: '92%', background: 'var(--gm)' }} />
        <span style={{ width: '8%', background: 'var(--rm)' }} />
      </div>
      <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
        <span>{kpiStatus.healthy} Healthy</span>
        <span>{kpiStatus.unhealthy} Unhealthy</span>
      </div>
      <div className="mt-3 overflow-y-auto flex-1 min-h-0 pr-1">
        {kpiStatus.items.map((item, i) => (
          <div
            key={i}
            onClick={() => item.bad && onKpiClick(item.name)}
            className={`flex items-center gap-2 py-1.5 px-1 rounded-md hover:bg-gray-50 ${item.bad ? 'cursor-pointer' : ''}`}
          >
            <span
              className="w-2.5 h-2.5 rounded-[2px] shrink-0"
              style={{ background: item.bad ? 'var(--rm)' : 'var(--gm)' }}
            />
            <span className="flex-1 text-[12px] text-gray-700 truncate">{item.name}</span>
            {item.bad && <span className="text-[11px] text-gray-400">{item.count} incidents</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function IncidentsTrendCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 flex flex-col h-[240px] min-h-0">
      <div className="text-[13px] font-bold text-gray-800">Incidents Trend</div>
      <div className="flex-1 min-h-0 relative mt-3">
        <svg viewBox="0 0 460 210" preserveAspectRatio="none" className="w-full h-full block">
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--bl)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--bl)" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          <line x1="30" y1="14" x2="456" y2="14" stroke="var(--bd)" strokeWidth="1" />
          <line x1="30" y1="99" x2="456" y2="99" stroke="var(--bd)" strokeWidth="1" />
          <line x1="30" y1="184" x2="456" y2="184" stroke="var(--bd)" strokeWidth="1" />
          <path d={`${TREND_PATH} L452,184 L30,184 Z`} fill="url(#trendGrad)" stroke="none" />
          <path
            d={TREND_PATH}
            fill="none"
            stroke="var(--bl)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute left-[6.5%] right-[0.5%] bottom-0 flex justify-between text-[11px] text-gray-400 pointer-events-none">
          {TREND_X.map((x) => (
            <span key={x}>{x}</span>
          ))}
        </div>
        {TREND_Y.map((y) => (
          <span
            key={y.label}
            className="absolute left-0 text-[11px] text-gray-400 -translate-y-1/2 pointer-events-none"
            style={{ top: y.top }}
          >
            {y.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function KpiSquares({ count }: { count: number }) {
  const colors = ['#ef4444', '#fb923c', '#facc15', '#22c55e']
  return (
    <div className="flex space-x-[2px]">
      {Array.from({ length: count }, (_, i) => {
        const p = i / count
        const color = p < 0.4 ? colors[0] : p < 0.7 ? colors[1] : p < 0.9 ? colors[2] : colors[3]
        return (
          <div key={i} className="w-[10px] h-[10px]" style={{ backgroundColor: color }} />
        )
      })}
    </div>
  )
}

function RiskGauge({ risk, color = '#ef4444' }: { risk: number; color?: string }) {
  const r = 14
  const circ = 2 * Math.PI * r
  const dash = (risk / 100) * circ
  return (
    <div className="flex flex-row items-center justify-center" style={{ width: 60 }}>
      <svg width="36" height="36" viewBox="0 0 36 36" className="mb-1">
        <circle cx="18" cy="18" r={r} fill="none" stroke="#e5e7eb" strokeWidth="7" />
        <circle cx="18" cy="18" r={r} fill="none" stroke={color} strokeWidth="7" strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 18 18)" />
      </svg>
      <div className="ml-1">
        <div className="text-[16px] font-semibold text-gray-900">{risk}%</div>
        <div className="text-[9px] text-gray-500">Risk</div>
      </div>
    </div>
  )
}

const assetTableRows = Array.from({ length: 5 }, () => ({
  name: 'Chiller 10',
  type: 'Chiller',
  status: 'ON',
  uptime: '89.6%',
  risk: 10 + Math.floor(Math.random() * 86),
  kpi: '89.6%',
  kpiCount: 5 + Math.floor(Math.random() * 11),
}))

type LastViewedItem = {
  type: 'asset' | 'incident' | 'task'
  time?: string
  title: string
  sub: string
  avatar?: string
  path: string[]
}

const lastViewed: LastViewedItem[] = [
  { type: 'asset', title: 'Chiller 10', sub: 'Risk Score : 89.6% ▲ 10%', path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { type: 'incident', time: '02/08/2026, 9:00 am', title: 'Compressor Specific Power High', sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { type: 'task', title: 'Inspect Cooling Tower Fans', sub: 'Overdue by : 1d 4h', avatar: 'AJ', path: ['Nestle UAE', 'HVAC', 'Cooling Tower A'] },
  { type: 'incident', time: '02/08/2026, 9:00 am', title: 'Compressor Specific Power High', sub: 'Compressor 3 Specific Power : 2.23kW/CFM ▲10%', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
]

function LastViewedCard() {
  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden h-[240px] flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100 text-sm font-bold text-gray-800 shrink-0">Last Viewed</div>
      <div className="flex-1 min-h-0 overflow-y-auto">
        {lastViewed.map((item) => (
          <div key={item.title + item.path.length} className="px-4 py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <span className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${item.type === 'asset' ? 'bg-[#E3F2FD] text-[#1565C0]' : item.type === 'incident' ? 'bg-[#FFEBEE] text-[#dc3545]' : 'bg-[#E8F5E9] text-[#2E7D32]'}`}>
                {item.type === 'asset' ? <Wrench className="w-3.5 h-3.5" strokeWidth={1.8} /> : item.type === 'incident' ? <span className="w-[13px] h-[13px] shrink-0 transition-all opacity-70 group-hover:opacity-100" style={{ background: '#dc3545', WebkitMaskImage: 'url(/incidents.svg)', maskImage: 'url(/incidents.svg)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskPosition: 'center', maskPosition: 'center' }} /> : <span className="w-[13px] h-[13px] shrink-0 transition-all opacity-70 group-hover:opacity-100" style={{ background: '#2E7D32', WebkitMaskImage: 'url(/Tasks.svg)', maskImage: 'url(/Tasks.svg)', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat', WebkitMaskSize: 'contain', maskSize: 'contain', WebkitMaskPosition: 'center', maskPosition: 'center' }} />}
              </span>
              <div className="flex-1 min-w-0">
                {item.time && <div className="text-[10px] text-gray-400">{item.time}</div>}
                <div className="flex items-center"><div className="text-[12px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{item.title}</div></div>
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
  )
}

function OverviewTab() {
  const [popupKpi, setPopupKpi] = useState<string | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<IncidentItem | null>(null)

  return (
    <>
      {popupKpi && !selectedIncident && (
        <KpiIncidentsList
          kpiName={popupKpi}
          onSelectIncident={setSelectedIncident}
          onClose={() => setPopupKpi(null)}
        />
      )}
      {selectedIncident && (
        <IncidentPopup
          incident={selectedIncident}
          onBack={() => setSelectedIncident(null)}
          onClose={() => { setSelectedIncident(null); setPopupKpi(null) }}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <KpiStatusCard onKpiClick={(name) => { setPopupKpi(name); setSelectedIncident(null) }} />
        <IncidentsTrendCard />
        <LastViewedCard />
      </div>

      <div className="bg-white border border-gray-200 rounded-md overflow-hidden flex flex-col shrink-0">
        <div className="px-4 pt-3 pb-2 shrink-0">
          <div className="text-[13px] font-bold text-gray-800 whitespace-nowrap">Assets (10)</div>
        </div>
        <div className="pb-1">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#ECF2FA]">
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">Asset Name</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">Asset type</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">Uptime</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">Risk Score</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">KPI Indicator</th>
                <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-400 py-2 px-3 border-b border-gray-100 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {assetTableRows.map((r, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {r.status === 'ON' ? (
                        <div className="flex-shrink-0 w-2.5">
                          <div className="relative flex items-center justify-center" style={{ width: 10, height: 10 }}>
                            <div className="absolute w-2.5 h-2.5 rounded-full opacity-30 animate-ping" style={{ backgroundColor: 'rgb(0, 109, 91)' }} />
                            <div className="absolute w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgb(0, 109, 91)' }} />
                          </div>
                        </div>
                      ) : (
                        <span className="relative inline-flex w-2.5 h-2.5 shrink-0">
                          <span className="relative inline-flex items-center justify-center w-2.5 h-2.5 rounded-full bg-[#C62828] animate-pulse" />
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">{r.name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-sm text-gray-600 whitespace-nowrap">{r.type}</td>
                  <td className="py-2.5 px-3 text-sm text-gray-900 whitespace-nowrap">{r.uptime}</td>
                  <td className="py-2.5 px-3">
                    <RiskGauge risk={r.risk} />
                  </td>
                  <td className="py-2.5 px-3">
                    <KpiSquares count={r.kpiCount} />
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="flex-shrink-0 flex items-center border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
                      <button className="flex flex-col items-center justify-center px-2 py-1 text-gray-700 hover:bg-blue-50 transition-colors border-r border-gray-300 cursor-pointer min-w-[46px]">
                        <PenLine className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="text-[10px] mt-1">Task</span>
                      </button>
                      <button className="flex flex-col items-center justify-center px-2 py-1 text-gray-700 hover:bg-blue-50 transition-colors cursor-pointer min-w-[82px]">
                        <TriangleAlert className="w-3.5 h-3.5" strokeWidth={2} />
                        <span className="text-[10px] mt-1">Report Failure</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function Placeholder({ name }: { name: string }) {
  return (
    <div className="flex-1 flex items-center justify-center border border-dashed border-gray-300 rounded-md text-[13px] text-gray-400 bg-white">
      {name}
    </div>
  )
}

export default function DashboardPage({ siteName, selectedUnitPath }: Props) {
  const [tab, setTab] = useState('Overview')
  const [selectedPath, setSelectedPath] = useState<string[]>(selectedUnitPath?.length ? selectedUnitPath : [siteName])
  const [ahCollapsed, setAhCollapsed] = useState(false)
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true)

  const isAssetSelected = selectedPath.length >= 4
  const isSiteSelected = selectedPath.length >= 1

  const findNodeByPath = (nodes: TreeNode[], path: string[], depth: number): TreeNode | null => {
    for (const node of nodes) {
      if (node.name === path[depth]) {
        if (depth < path.length - 1 && node.children) {
          return findNodeByPath(node.children, path, depth + 1)
        }
        return node
      }
    }
    return null
  }

  const filteredBreadcrumb = selectedPath.filter((_name, i) => {
    if (i === 0 || i === selectedPath.length - 1) return true
    const node = findNodeByPath(hierarchy.children || [], selectedPath.slice(1, i + 1), 0)
    return node && node.kind !== 'system'
  })

  const handleBreadcrumbClick = (index: number) => {
    setSelectedPath(selectedPath.slice(0, index + 1))
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden bg-[#F8FAFC]">
      <HierarchyPanel siteName={siteName} onSelect={setSelectedPath} selectedUnitPath={selectedUnitPath} selectedPath={selectedPath} collapsed={ahCollapsed} setCollapsed={setAhCollapsed} />

      <div className="flex-1 flex flex-col min-w-0 min-h-0 bg-white">
        <div className="px-4 lg:px-6 pt-3 shrink-0">
          <div className="flex items-center gap-1.5 text-[12px] text-gray-500 flex-wrap">
            {ahCollapsed && (
              <button
                onClick={() => setAhCollapsed(false)}
                className="rp-collapse-btn group relative rounded-md"
                style={{ padding: 6, background: '#f3f4f6' }}
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3.5" width="14" height="13" rx="2" />
                  <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
                  <path d="M9 7.5l2.5 2.5-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="absolute -left-1.5 top-1/2 -translate-y-1/2">
                    <path d="M7 1L1 6L7 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Asset hierarchy
                </span>
              </button>
            )}
            {filteredBreadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <span
                  onClick={() => handleBreadcrumbClick(i)}
                  className={`cursor-pointer hover:text-blue-600 transition-colors ${i === filteredBreadcrumb.length - 1 ? 'font-semibold text-gray-800' : ''}`}
                >
                  {item}
                </span>
              </span>
            ))}
            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="ml-auto p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title={rightSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3" width="14" height="14" rx="2" />
                <line x1="13" y1="3" x2="13" y2="17" />
              </svg>
            </button>
          </div>
          <div className="border-b border-gray-200 mt-2" />
        </div>

        <div className="px-4 lg:px-6 pt-3 shrink-0 flex items-stretch gap-1.5 flex-wrap border-b border-gray-200 font-semibold">
          {TABS.map((t, i) => (
            <span key={t} className="flex items-stretch gap-1.5">
              {i === 5 && <span className="w-px h-4 bg-gray-300 mx-1 self-center" />}
              <button
                onClick={() => setTab(t)}
                className={`flex items-center px-2 text-[12px] font-semibold transition border-b-2 -mb-px ${
                  tab === t
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-400 hover:text-blue-600 border-transparent'
                }`}
              >
                {t}
              </button>
            </span>
          ))}
          <button className="w-7 h-7 rounded-full bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto px-4 lg:px-6 py-4 flex flex-col gap-4">
          {isSiteSelected && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 shrink-0">
              {kpis.map((k) => {
                const iconMap: Record<string, { icon: React.ReactNode; bg: string }> = {
                  'Power Consumption': {
                    bg: 'bg-amber-50',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    ),
                  },
                  'Thermal Consumption': {
                    bg: 'bg-orange-50',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600">
                        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
                      </svg>
                    ),
                  },
                  'Water Consumption': {
                    bg: 'bg-blue-50',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                      </svg>
                    ),
                  },
                  'GHG Emissions': {
                    bg: 'bg-gray-100',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
                      </svg>
                    ),
                  },
                  'Savings': {
                    bg: 'bg-green-50',
                    icon: (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    ),
                  },
                }
                return (
                  <div key={k.label} className="bg-white border border-gray-200 rounded-md pt-3 px-4 overflow-hidden flex flex-col">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                      <span className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded ${iconMap[k.label].bg}`}>
                        {iconMap[k.label].icon}
                      </span>
                      {k.label}
                    </div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold text-gray-900">
                        {k.value}
                        <span className="text-[11px] font-medium text-gray-400 ml-0.5">{k.unit}</span>
                      </span>
                      <span className="text-[11px] font-bold" style={{ color: k.deltaColor }}>{k.delta}</span>
                    </div>
                    <div className="mt-2 -mx-4">
                      <svg viewBox="0 0 220 26" preserveAspectRatio="none" className="w-full h-[26px] block">
                        <path d={`${k.path} L220,26 L0,26 Z`} fill={k.color} opacity="0.15" />
                        <path d={k.path} fill="none" stroke={k.color} strokeWidth="1.5" strokeLinejoin="miter" />
                      </svg>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {isAssetSelected ? (
            <AssetOverview />
          ) : tab === 'Overview' ? (
            <OverviewTab />
          ) : (
            <Placeholder name={tab} />
          )}
        </div>
      </div>

      {rightSidebarOpen && <RightSidebar onClose={() => setRightSidebarOpen(false)} />}
    </div>
  )
}
