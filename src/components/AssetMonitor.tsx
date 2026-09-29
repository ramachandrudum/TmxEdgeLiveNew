import Gantt, { type GanttTask } from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Download,
  Filter,
  History,
  MoreVertical,
  Search,
  TriangleAlert,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react'
import {
  ATRK_START,
  ATRK_TOTAL_DAYS,
  eventSpan,
  ganttStamp,
  historyRows,
  kpiRows,
  riskRows,
  type MonitorAsset,
  type MonitorEvent,
  type MonitorTask,
  type TrackRow,
} from '../data/assetMonitor'
import { TaskDetailPopup, TaskListPopup } from './TasksPopup'

const INCIDENT = '#dc3545'
const DEVIATION = '#f59e0b'

const DAY_MS = 86_400_000

const EVENT_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'incident', label: 'Incident' },
  { value: 'deviation', label: 'Deviation' },
] as const

type View = 'timeline' | 'kpis' | 'risk' | 'history'

const VIEW_CHIPS: { id: View; label: string }[] = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'kpis', label: 'KPIs' },
  { id: 'risk', label: 'Risk Contributors' },
  { id: 'history', label: 'History' },
]

const INSIGHT_MENU: { id: View; label: string; Icon: typeof BarChart3 }[] = [
  { id: 'kpis', label: 'View KPIs', Icon: BarChart3 },
  { id: 'history', label: 'View Asset History', Icon: History },
  { id: 'risk', label: 'View risk contributors', Icon: TriangleAlert },
]

const RISK_CLASS: Record<MonitorAsset['riskLevel'], string> = {
  High: 'bg-red-50 text-red-700 border-red-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  Low: 'bg-green-50 text-green-700 border-green-200',
}

const selectClass =
  'h-7 rounded-md border border-gray-200 bg-white px-2 text-[11px] font-medium text-gray-700 outline-none cursor-pointer focus:border-blue-400'

const inputClass =
  'h-7 rounded-md border border-gray-200 bg-white pl-7 pr-2 text-[11px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-blue-400'

const TICK_COLOR = ['#cbd5e1', '#fbbf24', '#ef4444']

const LEVEL_LABEL: Record<number, string> = { 1: 'Normal', 2: 'Warning', 3: 'Failure' }

const dayStamp = (index: number) => ganttStamp(ATRK_START.getTime() + index * DAY_MS)

const shortDate = (index: number) =>
  new Date(ATRK_START.getTime() + index * DAY_MS).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

type MonitorGroup = { asset: MonitorAsset; events: MonitorEvent[] }
type MonitorBarTask = GanttTask & { event: MonitorEvent; asset: MonitorAsset }

const ROW_H = 48
const LANE_GAP = 2
const SVG_NS = 'http://www.w3.org/2000/svg'

const NOW_MS = Date.now()
const EMPTY_SPAN = {
  start: ganttStamp(NOW_MS - 30 * DAY_MS),
  end: ganttStamp(NOW_MS),
}

const stampMs = (stamp: string) => Date.parse(stamp.replace(' ', 'T') + 'Z')

const drawMonitorBars = (gantt: Gantt, groups: MonitorGroup[]) => {
  const layer = gantt.layers?.bar
  const dates = gantt.dates
  if (!layer || !dates || dates.length === 0) return

  gantt.$svg.querySelectorAll('.bar-wrapper').forEach((el) => {
    el.setAttribute('opacity', '0')
    ;(el as SVGElement).style.pointerEvents = 'none'
  })

  gantt.$svg.querySelector('.am-multi-bars')?.remove()

  const group = document.createElementNS(SVG_NS, 'g')
  group.setAttribute('class', 'am-multi-bars')
  layer.appendChild(group)

  const cw = gantt.config.column_width
  const header = gantt.config.header_height

  const columnOf = (ms: number) => {
    if (ms <= dates[0].getTime()) return 0
    const last = dates.length - 1
    if (ms >= dates[last].getTime()) return last
    let lo = 0
    let hi = last
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1
      if (dates[mid].getTime() <= ms) lo = mid
      else hi = mid - 1
    }
    return lo
  }

  groups.forEach((entry, rowIndex) => {
    const spans = entry.events
      .map((event) => ({ event, span: eventSpan(event) }))
      .sort((a, b) => stampMs(a.span.start) - stampMs(b.span.start))

    const laneEnds: number[] = []
    const lanes = spans.map(({ span }) => {
      const startMs = stampMs(span.start)
      let lane = laneEnds.findIndex((end) => end <= startMs)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(0)
      }
      laneEnds[lane] = stampMs(span.end)
      return lane
    })

    const laneCount = Math.max(laneEnds.length, 1)
    const barH = Math.max(4, Math.min(6, Math.floor((40 - (laneCount - 1) * LANE_GAP) / laneCount)))
    const stack = laneCount * barH + (laneCount - 1) * LANE_GAP
    const top = header + rowIndex * ROW_H + ROW_H / 2 - stack / 2

    spans.forEach(({ event, span }, index) => {
      const x1 = columnOf(stampMs(span.start)) * cw
      const x2 = columnOf(stampMs(span.end)) * cw
      const width = Math.max(cw * 0.3, x2 - x1)

      const rect = document.createElementNS(SVG_NS, 'rect')
      rect.setAttribute('x', String(x1))
      rect.setAttribute('y', String(top + lanes[index] * (barH + LANE_GAP)))
      rect.setAttribute('width', String(width))
      rect.setAttribute('height', String(barH))
      rect.setAttribute('rx', '1.5')
      rect.setAttribute('fill', event.kind === 'incident' ? INCIDENT : DEVIATION)
      rect.setAttribute('opacity', '0.92')
      group.appendChild(rect)
    })
  })
}

function useGantt(
  hostRef: RefObject<HTMLDivElement | null>,
  tasks: GanttTask[],
  enabled = true,
  viewMode: 'Day' | 'Month' = 'Day',
  scrollTo: 'start' | 'today' = 'start',
  drawOverlay?: (gantt: Gantt) => void,
) {
  const overlayRef = useRef(drawOverlay)

  useEffect(() => {
    overlayRef.current = drawOverlay
  }, [drawOverlay])

  useEffect(() => {
    if (!enabled) return
    const host = hostRef.current
    if (!host) return
    host.innerHTML = ''
    if (tasks.length === 0) return

    let ready = false
    const gantt = new Gantt(host, tasks, {
      view_mode: viewMode,
      view_mode_select: true,
      today_button: true,
      readonly: true,
      lines: 'both',
      infinite_padding: false,
      scroll_to: scrollTo,
      bar_height: 5,
      padding: 43,
      bar_corner_radius: 0,
      popup: () => false,
      on_view_change: () => {
        if (ready) overlayRef.current?.(gantt)
      },
    })
    ready = true
    overlayRef.current?.(gantt)

    const container = host.querySelector('.gantt-container')
    const fixMonthLabels = () => {
      const labels = Array.from(host.querySelectorAll<HTMLElement>('.upper-text'))
      labels.forEach((label) => {
        label.style.visibility = ''
      })
      const current = host.querySelector<HTMLElement>('.current-upper')
      if (!current) return
      const box = current.getBoundingClientRect()
      const collides = labels.some((label) => {
        if (label === current) return false
        const rect = label.getBoundingClientRect()
        return rect.left < box.right - 4 && rect.right > box.left + 4
      })
      if (collides) current.style.visibility = 'hidden'
    }
    const observer = new MutationObserver(fixMonthLabels)

    const assets = host.closest('.am-gantt')?.querySelector<HTMLElement>('.am-assets') ?? null
    let syncing = false
    const syncFromGantt = () => {
      if (syncing || !assets || !container) return
      syncing = true
      assets.scrollTop = container.scrollTop
      requestAnimationFrame(() => {
        syncing = false
      })
    }
    const syncFromAssets = () => {
      if (syncing || !container) return
      syncing = true
      container.scrollTop = assets?.scrollTop ?? 0
      requestAnimationFrame(() => {
        syncing = false
      })
    }

    if (container) {
      container.addEventListener('scroll', fixMonthLabels, { passive: true })
      container.addEventListener('scroll', syncFromGantt, { passive: true })
      assets?.addEventListener('scroll', syncFromAssets, { passive: true })
      observer.observe(container, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] })
      fixMonthLabels()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', fixMonthLabels)
        container.removeEventListener('scroll', syncFromGantt)
      }
      assets?.removeEventListener('scroll', syncFromAssets)
      observer.disconnect()
      gantt.clear()
      host.innerHTML = ''
    }
  }, [hostRef, tasks, enabled, viewMode, scrollTo])
}

type Props = {
  assets: MonitorAsset[]
  isAsset?: boolean
  onOpenAsset?: (name: string) => void
}

function OnOffDot({ on }: { on: boolean }) {
  const color = on ? '#006E4E' : '#9ca3af'
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0" title={on ? 'Running' : 'Stopped'}>
      {on && <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: color }} />}
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color, boxShadow: on ? '0 0 0 2px rgba(0, 110, 78, 0.16)' : undefined }} />
    </span>
  )
}

export default function AssetMonitor({ assets, isAsset = true, onOpenAsset }: Props) {
  const [view, setView] = useState<View>('timeline')
  const [eventFilter, setEventFilter] = useState<'all' | 'incident' | 'deviation'>('all')
  const [assetFilter, setAssetFilter] = useState('all')
  const [onlyActivity, setOnlyActivity] = useState(true)
  const [openInsights, setOpenInsights] = useState<string | null>(null)
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const [openTasksId, setOpenTasksId] = useState<string | null>(null)
  const [taskDetail, setTaskDetail] = useState<MonitorTask | null>(null)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const hostRef = useRef<HTMLDivElement>(null)

  const activeView: View = isAsset ? view : 'timeline'

  const goInsights = (next: View, assetName: string) => {
    setOpenInsights(null)
    setOpenMenu(null)
    setOpenTasksId(null)
    setView(next)
    if (!isAsset) onOpenAsset?.(assetName)
  }

  const scopedIds = new Set(assets.map((a) => a.id))
  const activeAssetFilter = assetFilter !== 'all' && scopedIds.has(assetFilter) ? assetFilter : 'all'

  const groups = useMemo<MonitorGroup[]>(() => {
    const needle = query.trim().toLowerCase()
    const out: MonitorGroup[] = []
    for (const asset of assets) {
      if (activeAssetFilter !== 'all' && asset.id !== activeAssetFilter) continue
      const events = eventFilter === 'all' ? asset.events : asset.events.filter((e) => e.kind === eventFilter)
      const visible = needle
        ? events.filter(
            (e) => e.title.toLowerCase().includes(needle) || asset.name.toLowerCase().includes(needle),
          )
        : events
      if (onlyActivity && visible.length === 0) continue
      out.push({ asset, events: visible })
    }
    return out
  }, [assets, activeAssetFilter, eventFilter, onlyActivity, query])

  const tasks = useMemo<MonitorBarTask[]>(
    () =>
      groups.map((group) => {
        const spans = group.events.map((event) => eventSpan(event))
        const fallback = EMPTY_SPAN
        const start = spans.reduce((min, s) => (s.start < min ? s.start : min), spans[0]?.start ?? fallback.start)
        const end = spans.reduce((max, s) => (s.end > max ? s.end : max), spans[0]?.end ?? fallback.end)
        return {
          id: group.asset.id,
          name: group.asset.name,
          start,
          end,
          event: group.events[0],
          asset: group.asset,
        }
      }),
    [groups],
  )

  useGantt(
    hostRef,
    tasks,
    activeView === 'timeline',
    'Month',
    'today',
    (gantt) => drawMonitorBars(gantt, groups),
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden">
      {isAsset && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <h3 className="text-[15px] font-bold text-gray-900">Asset Monitor</h3>
            {activeView === 'timeline' && (
              <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: INCIDENT }} />
                  Incident
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: DEVIATION }} />
                  Deviation
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {VIEW_CHIPS.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setOpenInsights(null)
                  setOpenMenu(null)
                  setOpenTasksId(null)
                  setView(chip.id)
                }}
                className={`badge badge-sm ${activeView === chip.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeView === 'timeline' && (
        <>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button type="button" onClick={() => setOnlyActivity((v) => !v)} aria-pressed={onlyActivity} className="flex items-center gap-2">
              <span className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${onlyActivity ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${onlyActivity ? 'translate-x-3' : ''}`} />
              </span>
              <span className="text-[11px] text-gray-600">Show only assets with activity</span>
            </button>

            <button
              type="button"
              className="btn btn-md ml-auto text-[#005EDB] border border-[#005EDB]/25 hover:bg-[#005EDB] hover:text-white hover:shadow-md"
            >
              <Download className="w-4 h-4" strokeWidth={2.2} />
              Export
            </button>
          </div>

          {groups.length === 0 ? (
            <div className="shrink-0 rounded-md border border-gray-200 bg-white px-4 py-10 text-center text-[13px] text-gray-400">
              No assets match the current filters.
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="am-gantt am-timeline min-h-0 flex-1 overflow-hidden rounded-md border border-gray-200 bg-white">
                <div className="flex h-full min-h-0">
                  <div className="am-assets h-full w-[260px] shrink-0 overflow-y-auto border-r border-[#ebeff2]">
                    <div className="sticky top-0 z-10 flex h-[85px] flex-col justify-end gap-1.5 border-b border-[#c7c7c7] bg-white px-3 pb-2.5">
                      <div className="flex h-7 w-full items-center rounded-md border border-gray-200 bg-white p-0.5" role="group" aria-label="Event type">
                        {EVENT_OPTIONS.map((o) => (
                          <button
                            key={o.value}
                            type="button"
                            aria-pressed={eventFilter === o.value}
                            onClick={() => setEventFilter(o.value)}
                            className={`h-full flex-1 rounded-[4px] px-2.5 text-[11px] font-medium transition-colors ${
                              eventFilter === o.value ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                            }`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <select
                          className="h-7 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 text-[11px] font-medium text-gray-700 outline-none cursor-pointer focus:border-blue-400"
                          value={activeAssetFilter}
                          onChange={(e) => setAssetFilter(e.target.value)}
                          aria-label="Asset"
                        >
                          <option value="all">All Assets</option>
                          {assets.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name}
                            </option>
                          ))}
                        </select>
                        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                          {searchOpen ? (
                            <div className="absolute bottom-0 right-0 z-20 h-7 w-[190px]">
                              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                              <input
                                autoFocus
                                className="h-7 w-full rounded-md border border-blue-400 bg-white pl-7 pr-2 text-[11px] text-gray-700 shadow-md outline-none placeholder:text-gray-400"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onBlur={() => setSearchOpen(false)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Escape') setSearchOpen(false)
                                }}
                                placeholder="Search assets"
                                aria-label="Search assets"
                              />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSearchOpen(true)}
                              title="Search assets"
                              aria-label="Search assets"
                              className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                            >
                              <Search className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                  {groups.map((group) => {
                    const asset = group.asset
                    return (
                    <div key={asset.id} className="am-row relative flex h-12 flex-col justify-center gap-1 border-b border-[#ebeff2] px-3">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <OnOffDot on={asset.on} />
                        <span className="min-w-0 truncate text-[12.5px] font-semibold text-gray-800">
                          {asset.name}
                        </span>
                        <span className={`ml-auto shrink-0 rounded border px-1 py-px text-[9px] font-bold ${RISK_CLASS[asset.riskLevel]}`}>
                          {asset.risk}% Risk
                        </span>
                        <button
                          type="button"
                          aria-label={`Actions for ${asset.name}`}
                          title="Actions"
                          onClick={() => {
                            setOpenInsights(null)
                            setOpenTasksId(null)
                            setOpenMenu((id) => (id === asset.id ? null : asset.id))
                          }}
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-colors cursor-pointer ${
                            openMenu === asset.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-300 hover:bg-gray-100 hover:text-gray-600'
                          }`}
                        >
                          <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {openMenu === asset.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setOpenMenu(null)}
                            className="fixed inset-0 z-20 cursor-default"
                          />
                          <div className="absolute right-2 top-full z-30 mt-1 w-[196px] rounded-md border border-gray-200 bg-white p-1 shadow-xl">
                            {INSIGHT_MENU.map(({ id, label, Icon }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null)
                                  goInsights(id, asset.name)
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                                {label}
                              </button>
                            ))}
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenu(null)
                                setQuery('')
                                setSearchOpen(false)
                                setAssetFilter(asset.id)
                              }}
                              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                            >
                              <Filter className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                              Show only this asset
                            </button>
                            {!isAsset && onOpenAsset && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenMenu(null)
                                  onOpenAsset(asset.name)
                                }}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              >
                                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                                Open asset
                              </button>
                            )}
                          </div>
                        </>
                      )}

                      <div className="flex min-w-0 items-center gap-1.5 pl-4 text-[11px] leading-none">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenu(null)
                            setOpenInsights(null)
                            setTaskDetail(null)
                            setOpenTasksId((id) => (id === asset.id ? null : asset.id))
                          }}
                          className="font-medium text-blue-600 hover:underline"
                          aria-expanded={openTasksId === asset.id}
                        >
                          {asset.tasks} {asset.tasks === 1 ? 'task' : 'tasks'}
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenu(null)
                            setOpenTasksId(null)
                            setOpenInsights((id) => (id === asset.id ? null : asset.id))
                          }}
                          className="flex items-center gap-0.5 font-medium text-blue-600 hover:underline"
                        >
                          Insights
                          <ChevronDown className={`h-3 w-3 transition-transform ${openInsights === asset.id ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {openInsights === asset.id && (
                        <>
                          <button
                            type="button"
                            aria-label="Close insights"
                            onClick={() => setOpenInsights(null)}
                            className="fixed inset-0 z-20 cursor-default"
                          />
                          <div className="absolute left-2 top-full z-30 mt-1 w-[196px] rounded-md border border-gray-200 bg-white p-1 shadow-xl">
                            <div className="px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                              Insights · {asset.name}
                            </div>
                            {INSIGHT_MENU.map(({ id, label, Icon }) => (
                              <button
                                key={id}
                                type="button"
                                onClick={() => goInsights(id, asset.name)}
                                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[11px] font-medium text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              >
                                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.2} />
                                {label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    )
                  })}
                </div>

                <div className="h-full min-w-0 flex-1">
                  <div ref={hostRef} className="h-full" />
                </div>
                {openTasksId && (() => {
                  const tasksAsset = assets.find((a) => a.id === openTasksId)
                  if (!tasksAsset) return null
                  return (
                    <>
                      {!taskDetail ? (
                        <TaskListPopup
                          asset={tasksAsset}
                          onSelect={setTaskDetail}
                          onClose={() => setOpenTasksId(null)}
                        />
                      ) : (
                        <TaskDetailPopup
                          asset={tasksAsset}
                          task={taskDetail}
                          onBack={() => setTaskDetail(null)}
                          onClose={() => { setOpenTasksId(null); setTaskDetail(null) }}
                        />
                      )}
                    </>
                  )
                })()}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeView !== 'timeline' && (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {activeView === 'kpis' && <TrackView rows={kpiRows} label="Measure" />}
          {activeView === 'risk' && <TrackView rows={riskRows} label="Contributor" />}
          {activeView === 'history' && <HistoryView />}
        </div>
      )}
    </div>
  )
}

type TrackEntry = {
  key: string
  row: TrackRow
  first: boolean
  level: number
  startIdx: number
  endIdx: number
}

function TrackView({ rows, label }: { rows: TrackRow[]; label: string }) {
  const [failuresOnly, setFailuresOnly] = useState(false)
  const [windowDays, setWindowDays] = useState(ATRK_TOTAL_DAYS)
  const [query, setQuery] = useState('')
  const hostRef = useRef<HTMLDivElement>(null)

  const offset = ATRK_TOTAL_DAYS - windowDays

  const { entries, tasks } = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list: TrackEntry[] = []

    for (const row of rows) {
      if (needle && !row.name.toLowerCase().includes(needle)) continue

      let start = -1
      let level = 0
      const flush = (endIdx: number) => {
        if (start < 0) return
        list.push({ key: `${row.id}-${start}`, row, first: false, level, startIdx: start, endIdx })
        start = -1
        level = 0
      }

      for (let i = offset; i <= ATRK_TOTAL_DAYS; i++) {
        const raw = i < ATRK_TOTAL_DAYS ? (row.ticks[i] ?? 0) : 0
        const next = failuresOnly && raw < 3 ? 0 : raw
        if (next > 0) {
          if (start < 0) {
            start = i
            level = next
          } else if (next !== level) {
            flush(i - 1)
            start = i
            level = next
          }
        } else {
          flush(i - 1)
        }
      }
    }

    const seen = new Set<string>()
    for (const entry of list) {
      if (!seen.has(entry.row.id)) {
        seen.add(entry.row.id)
        entry.first = true
      }
    }

    return {
      entries: list,
      tasks: list.map((entry) => ({
        id: entry.key,
        name: entry.row.name,
        start: dayStamp(entry.startIdx),
        end: dayStamp(entry.endIdx + 1),
        color: TICK_COLOR[entry.level - 1],
      })),
    }
  }, [rows, query, offset, failuresOnly])

  useGantt(hostRef, tasks)

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => setFailuresOnly((v) => !v)} aria-pressed={failuresOnly} className="flex items-center gap-2">
          <span className={`flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${failuresOnly ? 'bg-blue-600' : 'bg-gray-300'}`}>
            <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${failuresOnly ? 'translate-x-3' : ''}`} />
          </span>
          <span className="text-[11px] text-gray-600">Show failures</span>
        </button>

        <select className={selectClass} value={windowDays} onChange={(e) => setWindowDays(Number(e.target.value))} aria-label="Time window">
          <option value={30}>Time Window: 30 days</option>
          <option value={21}>Time Window: 21 days</option>
          <option value={14}>Time Window: 14 days</option>
          <option value={7}>Time Window: 7 days</option>
        </select>

        <div className="relative">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search rows" aria-label="Search rows" />
        </div>

        <div className="ml-auto flex items-center gap-3 text-[10px] font-semibold text-gray-400">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: TICK_COLOR[0] }} /> Normal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: TICK_COLOR[1] }} /> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm" style={{ background: TICK_COLOR[2] }} /> Failure
          </span>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-md border border-gray-200 bg-white px-4 py-10 text-center text-[13px] text-gray-400">
          {query.trim() ? 'No rows match your search.' : 'No activity in this period.'}
        </div>
      ) : (
        <div className="am-gantt overflow-hidden rounded-md border border-gray-200 bg-white">
          <div className="flex">
            <div className="am-assets w-[260px] shrink-0 border-r border-[#ebeff2]">
              <div className="flex h-[85px] items-end justify-between border-b border-[#c7c7c7] px-3 pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Share</span>
              </div>

              {entries.map((entry) => (
                <div key={entry.key} className="am-row relative flex h-12 flex-col justify-center gap-1 border-b border-[#ebeff2] px-3">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-sm" style={{ background: entry.row.color }} />
                    <span
                      className={`min-w-0 truncate text-[12.5px] ${
                        entry.first ? 'font-semibold text-gray-800' : 'font-medium text-gray-600'
                      }`}
                    >
                      {entry.row.name}
                    </span>
                    {entry.first && (
                      <span className="ml-auto shrink-0 text-[10px] font-bold text-gray-500">{entry.row.share}%</span>
                    )}
                  </div>

                  <div className="flex min-w-0 items-center gap-2 text-[11px] leading-none">
                    <span className="min-w-0 flex-1 truncate text-gray-400">
                      {LEVEL_LABEL[entry.level]} · {shortDate(entry.startIdx)} – {shortDate(entry.endIdx)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="min-w-0 flex-1">
              <div ref={hostRef} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const HISTORY_TABS = [
  { id: 'all', label: 'All', count: historyRows.length },
  { id: 'incident', label: 'Incident', count: historyRows.filter((r) => r.type === 'incident').length },
  { id: 'task', label: 'Task', count: historyRows.filter((r) => r.type === 'task').length },
  { id: 'failure', label: 'Failure', count: historyRows.filter((r) => r.type === 'failure').length },
] as const

const TYPE_BADGE: Record<string, string> = {
  incident: 'bg-red-50 text-red-700 border-red-200',
  task: 'bg-blue-50 text-blue-700 border-blue-200',
  failure: 'bg-gray-900 text-white border-gray-900',
}

const STATUS_BADGE: Record<string, string> = {
  Open: 'bg-amber-50 text-amber-700',
  'In Progress': 'bg-blue-50 text-blue-700',
  Done: 'bg-green-50 text-green-700',
  Acknowledged: 'bg-gray-100 text-gray-600',
}

function HistoryView() {
  const [tab, setTab] = useState<'all' | 'incident' | 'task' | 'failure'>('all')
  const [query, setQuery] = useState('')

  const visible = historyRows.filter(
    (row) =>
      (tab === 'all' || row.type === tab) &&
      `${row.title} ${row.asset}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {HISTORY_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`badge badge-sm ${tab === t.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {t.label} {t.count}
          </button>
        ))}

        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search history" aria-label="Search history" />
        </div>

        <button
          type="button"
          className="btn btn-md text-[#005EDB] border border-[#005EDB]/25 hover:bg-[#005EDB] hover:text-white hover:shadow-md"
        >
          <Download className="w-4 h-4" strokeWidth={2.2} />
          Export
        </button>
      </div>

      <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-[var(--theme-surface-header)] text-[10px] uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-3 py-2 font-bold">When</th>
              <th className="px-3 py-2 font-bold">Type</th>
              <th className="px-3 py-2 font-bold">Event</th>
              <th className="px-3 py-2 font-bold">Asset</th>
              <th className="px-3 py-2 font-bold">Duration</th>
              <th className="px-3 py-2 font-bold">Status</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 text-[12px] transition-colors last:border-b-0 hover:bg-blue-50/40">
                <td className="whitespace-nowrap px-3 py-2.5 text-gray-500">{row.when}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold uppercase ${TYPE_BADGE[row.type]}`}>{row.type}</span>
                </td>
                <td className="px-3 py-2.5 font-semibold text-gray-800">{row.title}</td>
                <td className="px-3 py-2.5 text-gray-600">{row.asset}</td>
                <td className="px-3 py-2.5 text-gray-500">{row.duration}</td>
                <td className="px-3 py-2.5">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${STATUS_BADGE[row.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visible.length === 0 && (
          <div className="px-4 py-8 text-center text-[12px] text-gray-400">
            {tab === 'failure' ? 'No failure records in this period.' : 'No history records match your search.'}
          </div>
        )}
      </div>
    </div>
  )
}
