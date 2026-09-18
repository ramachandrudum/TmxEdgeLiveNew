import {
  Activity,
  BookOpen,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  FileBarChart,
  LineChart,
  MapPin,
  MonitorPlay,
  Plus,
  Rocket,
  Search,
  Tag,
  Workflow,
} from 'lucide-react'
import { useState } from 'react'
import {
  DOT_COLOR,
  TREND_PATH,
  TREND_X,
  TREND_Y,
  assetCards,
  hierarchy,
  incidentCards,
  kpiStatus,
  kpis,
  otherSites,
  taskCards,
  type NodeStatus,
  type TreeNode,
} from '../data/dashboardPage'
import AssetOverview from './AssetOverview'

type Props = {
  siteName: string
  onBack: () => void
  selectedUnitPath?: string[]
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
            ? 'text-blue-700 font-semibold'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
        style={{ paddingLeft: pad }}
        onMouseEnter={(e) => onShowTooltip(node.name, e.currentTarget)}
        onMouseLeave={onHideTooltip}
      >
        <Dot status={node.status ?? 'off'} />
        <span className="relative flex-1 min-w-0">
          <span className="block truncate uppercase">{node.name}</span>
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
            : 'text-gray-700 hover:bg-gray-50'
        }`}
        style={{ paddingLeft: node.kind === 'system' ? 35 : pad }}
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
          className={`flex-1 min-w-0 cursor-pointer ${node.kind === 'system' ? 'font-semibold text-gray-400' : ''}`}
        >
          <span className="block truncate uppercase">{node.name}</span>
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

function HierarchyPanel({ siteName, onBack, onSelect, selectedUnitPath, selectedPath, collapsed, setCollapsed }: { siteName: string; onBack: () => void; onSelect: (path: string[]) => void; selectedUnitPath?: string[]; selectedPath: string[]; collapsed: boolean; setCollapsed: (v: boolean) => void }) {
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
        <div className="flex items-center gap-2 py-1.5 px-2 rounded-md text-[13px] font-semibold text-blue-700 bg-blue-50">
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

function Sparkline({ id, color, path }: { id: string; color: string; path: string }) {
  return (
    <svg viewBox="0 0 220 26" preserveAspectRatio="none" className="w-full h-[26px] block">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.55" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={`${path} L220,26 L0,26 Z`} fill={`url(#${id})`} stroke="none" />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function KpiStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 shrink-0">
      {kpis.map((k, i) => (
        <div
          key={k.label}
          className="bg-white border border-gray-200 rounded-md pt-3 px-4 overflow-hidden flex flex-col"
        >
          <div className="text-[11px] font-semibold text-gray-500">{k.label}</div>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-gray-900">
              {k.value}
              <span className="text-[11px] font-medium text-gray-400 ml-0.5">{k.unit}</span>
            </span>
            <span className="text-[11px] font-bold" style={{ color: k.deltaColor }}>
              {k.delta}
            </span>
          </div>
          <div className="mt-2 -mx-4">
            <Sparkline id={`dashGrad${i}`} color={k.color} path={k.path} />
          </div>
        </div>
      ))}
    </div>
  )
}

function KpiStatusCard() {
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
            className="flex items-center gap-2 py-1.5 px-1 rounded-md hover:bg-gray-50 cursor-pointer"
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

type PaletteItem = {
  icon: React.ReactNode
  label: string
  meta?: string
  action?: string
  trailing?: React.ReactNode
}

function PaletteSection({
  icon,
  title,
  items,
}: {
  icon?: React.ReactNode
  title?: string
  items: PaletteItem[]
}) {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      {title && (
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-1.5">
          <span className="text-gray-400">{icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            {title}
          </span>
        </div>
      )}
      <div className={title ? 'pb-1.5' : 'py-1.5'}>
        {items.map((it) => (
          <div
            key={it.label}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer"
          >
            <span className="text-gray-400 shrink-0">{it.icon}</span>
            <span className="flex-1 min-w-0 text-[12px] text-gray-700 truncate">{it.label}</span>
            {it.meta && (
              <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
                {it.meta}
              </span>
            )}
            {it.action && (
              <button className="text-[10px] font-semibold text-blue-600 border border-blue-200 rounded px-1.5 py-0.5 hover:bg-blue-50 shrink-0 cursor-pointer">
                {it.action}
              </button>
            )}
            {it.trailing && <span className="text-gray-300 shrink-0">{it.trailing}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

function CommandPalette() {
  return (
    <div className="relative bg-white border border-gray-200 rounded-md flex flex-col min-h-0 h-[240px]">
      <div className="flex items-center px-3 h-9 shrink-0">
        <span className="text-[13px] font-bold text-gray-800">Recent Activity</span>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <PaletteSection
          items={[
            {
              icon: <Activity className="w-3.5 h-3.5" />,
              label: 'Asset Monitor > Turbine Block A',
              meta: '2 mins ago',
            },
            {
              icon: <Tag className="w-3.5 h-3.5" />,
              label: 'Tag Mapper > Unit 3 Steam Pipeline',
              meta: '8 mins ago',
            },
          ]}
        />
        <PaletteSection
          icon={<Clock className="w-3.5 h-3.5" />}
          title="Recent Items & Records"
          items={[
            {
              icon: <BookOpen className="w-3.5 h-3.5" />,
              label: 'Digital Logbook: Shift Handover - Night Shift',
              meta: '5 mins ago',
            },
            {
              icon: <LineChart className="w-3.5 h-3.5" />,
              label: 'Incidents Timeline: Valve Pressure Spike #4021',
              meta: '12 mins ago',
            },
            {
              icon: <FileBarChart className="w-3.5 h-3.5" />,
              label: 'Reports Builder: Weekly OEE Performance',
              meta: '1 hour ago',
            },
          ]}
        />
        <PaletteSection
          icon={<Rocket className="w-3.5 h-3.5" />}
          title="Recent Tools & Modules"
          items={[
            {
              icon: <MonitorPlay className="w-3.5 h-3.5" />,
              label: 'DCS Graphics - v2',
              trailing: (
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#006D4E]">Active</span>
                  <span className="text-[10px] text-gray-400">2 hours ago</span>
                </span>
              ),
            },
            {
              icon: <Workflow className="w-3.5 h-3.5" />,
              label: 'Rule Engine',
              trailing: (
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-[#006D4E]">Active</span>
                  <span className="text-[10px] text-gray-400">1 day ago</span>
                </span>
              ),
            },
          ]}
        />
      </div>
    </div>
  )
}

function Chips({ items }: { items: { status: NodeStatus; label: string; count: number }[] }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-thin hover:overflow-x-scroll pb-1">
      {items.map((c) => (
        <button
          key={c.label}
          className="flex items-center gap-1 px-2 py-1 rounded-full border border-gray-200 bg-white text-[10px] text-gray-600 hover:bg-gray-50 shrink-0"
        >
          <Dot status={c.status} size={7} />
          {c.label} ({c.count})
        </button>
      ))}
    </div>
  )
}

function SegBar({ segs }: { segs: { rm: number; aym: number; gm: number } }) {
  const squares = [
    ...Array(segs.rm).fill('var(--rm)'),
    ...Array(segs.aym).fill('var(--aym)'),
    ...Array(segs.gm).fill('var(--gm)'),
  ]
  const total = squares.length
  return (
    <div className="risk-segbar flex flex-wrap gap-[3px]">
      {squares.map((color, i) => (
        <span key={i} className="inline-block rounded-[2px]" style={{ width: 10, height: 10, background: color }} />
      ))}
      <span className="sr-only">{total}</span>
    </div>
  )
}

function Trail({ path }: { path: string[] }) {
  return (
    <div className="border-t border-gray-100 mt-2 pt-1.5 text-[10px] text-gray-400 truncate">
      {path.map((p, i) => (
        <span key={p}>
          {i > 0 && <span className="mx-1 text-gray-300">&gt;</span>}
          {p}
        </span>
      ))}
    </div>
  )
}

function ColumnShell({
  title,
  chips,
  children,
}: {
  title: string
  chips: { status: NodeStatus; label: string; count: number }[]
  children: React.ReactNode
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-md flex flex-col min-h-0">
      <div className="px-4 pt-3 shrink-0">
        <div className="text-[13px] font-bold text-gray-800 mb-2">{title}</div>
        <Chips items={chips} />
      </div>
      <div className="p-3 space-y-2 overflow-y-auto max-h-[460px]">{children}</div>
    </div>
  )
}

function OverviewTab() {
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 shrink-0">
        <KpiStatusCard />
        <IncidentsTrendCard />
        <CommandPalette />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <ColumnShell
          title="Assets (10)"
          chips={[
            { status: 'cr', label: 'Critical', count: 3 },
            { status: 'ar', label: 'At Risk', count: 2 },
            { status: 'ok', label: 'Healthy', count: 5 },
          ]}
        >
          {assetCards.map((a) => (
            <div
              key={a.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Dot status={a.status} />
                <span className="text-[12px] font-semibold text-gray-900 truncate flex-1">
                  {a.name}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">
                  Risk Score : <b className="text-gray-900">{a.risk}%</b>{' '}
                  <span style={{ color: 'var(--r)' }}>{a.delta}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </div>
              <div className="mt-2">
                <SegBar segs={a.segs} />
              </div>
              <Trail path={a.path} />
            </div>
          ))}
        </ColumnShell>

        <ColumnShell
          title="Incidents (7)"
          chips={[
            { status: 'cr', label: 'Critical', count: 3 },
            { status: 'wr', label: 'Warning', count: 3 },
            { status: 'dv', label: 'Deviation', count: 1 },
          ]}
        >
          {incidentCards.map((inc) => (
            <div
              key={inc.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                    <span>{inc.time}</span>
                    {inc.badge && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold">
                        {inc.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Dot status={inc.status} />
                    <span className="text-[12px] font-semibold text-gray-900 truncate">
                      {inc.title}
                    </span>
                  </div>
                  {inc.sensors ? (
                    <div className="mt-1 text-[10px] text-gray-500">
                      {inc.sensors} sensors deviating
                    </div>
                  ) : (
                    <div className="mt-1 text-[10px] text-gray-500">
                      {inc.kpiLabel} : <b className="text-gray-900">{inc.kpiValue}</b>{' '}
                      {inc.kpiDelta && <span style={{ color: 'var(--r)' }}>{inc.kpiDelta}</span>}
                    </div>
                  )}
                  {inc.cause && (
                    <div className="mt-2 rounded-md bg-gray-50 border border-gray-200 p-2">
                      <div className="text-[10px] font-bold text-gray-600">
                        Root Causes and Recommended Actions
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{inc.cause}</div>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0 mt-1" />
              </div>
              <Trail path={inc.path} />
            </div>
          ))}
        </ColumnShell>

        <ColumnShell
          title="Tasks (5)"
          chips={[
            { status: 'cr', label: 'Overdue', count: 1 },
            { status: 'ar', label: 'Ongoing', count: 2 },
            { status: 'off', label: 'Not Started', count: 1 },
            { status: 'ok', label: 'Completed', count: 1 },
          ]}
        >
          {taskCards.map((t) => (
            <div
              key={t.id}
              className="border border-gray-200 rounded-lg p-3 hover:border-blue-200 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Dot status={t.status} />
                <span className="text-[12px] font-semibold text-gray-900 truncate flex-1">
                  {t.name}
                </span>
                <span className="text-[10px] text-gray-500 whitespace-nowrap">{t.due}</span>
                <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-[9px] font-bold flex items-center justify-center shrink-0">
                  {t.avatar}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
              </div>
              <Trail path={t.path} />
            </div>
          ))}
        </ColumnShell>
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

export default function DashboardPage({ siteName, onBack, selectedUnitPath }: Props) {
  const [tab, setTab] = useState('Overview')
  const [selectedPath, setSelectedPath] = useState<string[]>(selectedUnitPath?.length ? selectedUnitPath : [siteName])
  const [rpCollapsed, setRpCollapsed] = useState(false)
  const [ahCollapsed, setAhCollapsed] = useState(false)

  const isAssetSelected = selectedPath.length >= 4

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden bg-[#F8FAFC]">
      <HierarchyPanel siteName={siteName} onBack={onBack} onSelect={setSelectedPath} selectedUnitPath={selectedUnitPath} selectedPath={selectedPath} collapsed={ahCollapsed} setCollapsed={setAhCollapsed} />

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
            {selectedPath.map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gray-300">/</span>}
                <span className={i === selectedPath.length - 1 ? 'font-semibold text-gray-800' : ''}>
                  {item}
                </span>
              </span>
            ))}
          </div>
        </div>

        <div className="px-4 lg:px-6 pt-4 shrink-0">
          <KpiStrip />
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
          {isAssetSelected && rpCollapsed && (
            <button
              onClick={() => setRpCollapsed(false)}
              className="w-7 h-7 rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 flex items-center justify-center ml-auto"
              title="Show Incidents and Tasks"
            >
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="3" y="3.5" width="14" height="13" rx="2" />
                <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
                <path d="M9 7.5l2.5 2.5-2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        <div className={`flex-1 min-h-0 ${isAssetSelected ? '' : 'overflow-y-auto'} px-4 lg:px-6 py-4 flex flex-col gap-4`}>
          {isAssetSelected ? (
            <AssetOverview rpCollapsed={rpCollapsed} onToggleRp={() => setRpCollapsed(!rpCollapsed)} />
          ) : tab === 'Overview' ? (
            <OverviewTab />
          ) : (
            <Placeholder name={tab} />
          )}
        </div>
      </div>
    </div>
  )
}
