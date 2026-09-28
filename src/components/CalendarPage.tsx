import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  CALENDAR_CATEGORIES,
  CATEGORY_META,
  calendarEvents,
  type CalendarCategory,
  type CalendarEvent,
} from '../data/calendarEvents'

type ViewMode = 'month' | 'week' | 'day' | 'list'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAYS_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const HOUR_START = 6
const HOUR_END = 22
const ROW_H = 40

const CAT_LABEL = CALENDAR_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = c.label
    return acc
  },
  {} as Record<CalendarCategory, string>,
)

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const startOfWeek = (d: Date) => addDays(d, -d.getDay())
const sameDay = (a: Date, b: Date) => iso(a) === iso(b)
const hoursSince = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h + m / 60
}
const to12 = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}
const hourLabel = (h: number) => `${h % 12 === 0 ? 12 : h % 12} ${h >= 12 ? 'PM' : 'AM'}`
const longDate = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${WEEKDAYS_FULL[date.getDay()]}, ${MONTHS[date.getMonth()]} ${d} ${y}`
}
const buildCells = (anchor: Date) => {
  const start = startOfWeek(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
  return Array.from({ length: 42 }, (_, i) => addDays(start, i))
}

type Selectable = { onSelect: (e: CalendarEvent) => void }

function MonthGrid({
  cells,
  refMonth,
  byDate,
  today,
  onSelect,
}: Selectable & { cells: Date[]; refMonth: Date; byDate: Map<string, CalendarEvent[]>; today: Date }) {
  return (
    <div className="flex-1 min-h-0 overflow-auto flex flex-col">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-[var(--theme-surface-header)] sticky top-0 z-10">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-2 text-center text-[11px] font-bold uppercase tracking-wider text-gray-500">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 flex-1">
        {cells.map((d) => {
          const key = iso(d)
          const evs = byDate.get(key) ?? []
          const isOther = d.getMonth() !== refMonth.getMonth()
          const isToday = sameDay(d, today)
          return (
            <div key={key} className="border-r border-b border-gray-200 p-1.5 flex flex-col gap-1 min-h-[96px] overflow-hidden">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    isToday
                      ? 'inline-flex w-5 h-5 items-center justify-center rounded-full bg-blue-600 text-white'
                      : isOther
                        ? 'text-gray-300'
                        : 'text-gray-700'
                  }`}
                >
                  {d.getDate()}
                </span>
                {evs.length > 0 && <span className="text-[9px] font-bold text-gray-400">{evs.length}</span>}
              </div>
              {evs.slice(0, 3).map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => onSelect(e)}
                  title={`${to12(e.start)} · ${e.title}`}
                  className="text-left rounded px-1.5 py-0.5 text-[10px] leading-tight truncate border-l-2 cursor-pointer hover:brightness-95 transition-all"
                  style={{ background: CATEGORY_META[e.cat].bg, borderLeftColor: CATEGORY_META[e.cat].color }}
                >
                  {to12(e.start)} {e.title}
                </button>
              ))}
              {evs.length > 3 && <span className="text-[10px] font-semibold text-blue-600 cursor-pointer">+{evs.length - 3} more</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TimeGrid({ days, byDate, today, onSelect }: Selectable & { days: Date[]; byDate: Map<string, CalendarEvent[]>; today: Date }) {
  const hours = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i)
  const height = (HOUR_END - HOUR_START) * ROW_H

  return (
    <div className="flex-1 min-h-0 overflow-auto">
      <div className="min-w-[640px]">
        <div className="flex sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="w-[64px] shrink-0" />
          {days.map((d) => (
            <div key={iso(d)} className={`flex-1 py-2 text-center border-l border-gray-200 ${sameDay(d, today) ? 'bg-blue-50' : ''}`}>
              <div className="text-[11px] font-semibold text-gray-500">{WEEKDAYS[d.getDay()]}</div>
              <div
                className={`mx-auto mt-0.5 w-6 h-6 flex items-center justify-center rounded-full text-[13px] font-bold ${
                  sameDay(d, today) ? 'bg-blue-600 text-white' : 'text-gray-800'
                }`}
              >
                {d.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="relative flex" style={{ height }}>
          <div className="w-[64px] shrink-0 relative">
            {hours.map((h) => (
              <span
                key={h}
                className={`absolute right-2 text-[10px] text-gray-400 ${h === HOUR_START ? '' : '-translate-y-1/2'}`}
                style={{ top: (h - HOUR_START) * ROW_H }}
              >
                {hourLabel(h)}
              </span>
            ))}
          </div>

          {days.map((d) => {
            const evs = byDate.get(iso(d)) ?? []
            return (
              <div key={iso(d)} className={`relative flex-1 border-l border-gray-200 ${sameDay(d, today) ? 'bg-blue-50/40' : ''}`}>
                {hours.slice(0, -1).map((h) => (
                  <div key={h} className="absolute left-0 right-0 border-t border-gray-100" style={{ top: (h - HOUR_START) * ROW_H }} />
                ))}
                {evs.map((e) => {
                  const s = Math.max(hoursSince(e.start), HOUR_START)
                  const en = Math.min(hoursSince(e.end), HOUR_END)
                  const meta = CATEGORY_META[e.cat]
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => onSelect(e)}
                      title={e.desc ?? e.title}
                      className="absolute left-1 right-1 rounded px-1.5 py-1 text-left overflow-hidden border-l-2 cursor-pointer hover:brightness-95 transition-all"
                      style={{ top: (s - HOUR_START) * ROW_H, height: Math.max((en - s) * ROW_H, 22), background: meta.bg, borderLeftColor: meta.color }}
                    >
                      <div className="text-[9px] font-semibold text-gray-600">{to12(e.start)}</div>
                      <div className="text-[11px] font-semibold text-gray-900 truncate">{e.title}</div>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ListView({ events, onSelect }: Selectable & { events: CalendarEvent[] }) {
  const groups = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    events.forEach((e) => {
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    })
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [events])

  if (events.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto hover-scroll px-5 py-4 space-y-5">
      {groups.map(([date, evs]) => (
        <div key={date}>
          <div className="text-[12px] font-bold text-gray-500 mb-2">{longDate(date)}</div>
          <div className="border border-gray-200 rounded-md overflow-hidden divide-y divide-gray-100">
            {evs.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => onSelect(e)}
                className="w-full flex items-start gap-3 px-3 py-2.5 text-left bg-white hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <span className="text-[11px] font-semibold text-gray-500 w-[64px] shrink-0 pt-0.5">{to12(e.start)}</span>
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: CATEGORY_META[e.cat].color }} />
                <span className="flex-1 min-w-0">
                  <span className="block text-[13px] font-semibold text-gray-900 truncate">{e.title}</span>
                  {e.desc && <span className="block text-[11px] text-gray-500 truncate">{e.desc}</span>}
                </span>
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
                  style={{ background: CATEGORY_META[e.cat].bg, color: '#374151' }}
                >
                  {CAT_LABEL[e.cat]}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex-1 min-h-0 flex items-center justify-center text-[13px] text-gray-400">
      No events for the selected categories in this period.
    </div>
  )
}

export default function CalendarPage() {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const [current, setCurrent] = useState(today)
  const [view, setView] = useState<ViewMode>('month')
  const [picker, setPicker] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selected, setSelected] = useState(today)
  const [active, setActive] = useState<Set<CalendarCategory>>(
    () => new Set(CALENDAR_CATEGORIES.map((c) => c.id)),
  )

  const toggleCategory = (id: CalendarCategory) =>
    setActive((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const range = useMemo(() => {
    if (view === 'day') return { from: iso(current), to: iso(current) }
    if (view === 'week') {
      const s = startOfWeek(current)
      return { from: iso(s), to: iso(addDays(s, 6)) }
    }
    const from = iso(new Date(current.getFullYear(), current.getMonth(), 1))
    const to = iso(new Date(current.getFullYear(), current.getMonth() + 1, 0))
    return { from, to }
  }, [current, view])

  const visible = useMemo(
    () =>
      calendarEvents
        .filter((e) => active.has(e.cat) && e.date >= range.from && e.date <= range.to)
        .sort((a, b) => (a.date === b.date ? a.start.localeCompare(b.start) : a.date.localeCompare(b.date))),
    [active, range],
  )

  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    visible.forEach((e) => {
      const arr = map.get(e.date) ?? []
      arr.push(e)
      map.set(e.date, arr)
    })
    return map
  }, [visible])

  const monthCells = useMemo(() => buildCells(current), [current])
  const pickerCells = useMemo(() => buildCells(picker), [picker])
  const weekDays = useMemo(
    () => (view === 'week' ? Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(current), i)) : [current]),
    [current, view],
  )

  const counts = useMemo(() => {
    const map = new Map<CalendarCategory, number>()
    CALENDAR_CATEGORIES.forEach((c) => map.set(c.id, calendarEvents.filter((e) => e.cat === c.id).length))
    return map
  }, [])

  const title = useMemo(() => {
    if (view === 'month' || view === 'list') return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`
    if (view === 'week') {
      const s = startOfWeek(current)
      const e = addDays(s, 6)
      return `${MONTHS[s.getMonth()].slice(0, 3)} ${s.getDate()} – ${MONTHS[e.getMonth()].slice(0, 3)} ${e.getDate()}, ${e.getFullYear()}`
    }
    return `${WEEKDAYS_FULL[current.getDay()]}, ${MONTHS[current.getMonth()]} ${current.getDate()} ${current.getFullYear()}`
  }, [current, view])

  const go = (dir: -1 | 1) => {
    if (view === 'day') setCurrent((d) => addDays(d, dir))
    else if (view === 'week') setCurrent((d) => addDays(d, dir * 7))
    else setCurrent((d) => new Date(d.getFullYear(), d.getMonth() + dir, 1))
  }

  const goToday = () => {
    setCurrent(today)
    setSelected(today)
    setPicker(new Date(today.getFullYear(), today.getMonth(), 1))
  }

  const pickDay = (d: Date) => {
    setSelected(d)
    setCurrent(d)
    if (d.getMonth() !== picker.getMonth() || d.getFullYear() !== picker.getFullYear()) {
      setPicker(new Date(d.getFullYear(), d.getMonth(), 1))
    }
  }

  const selectEvent = (e: CalendarEvent) => {
    const [y, m, d] = e.date.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    setCurrent(date)
    setSelected(date)
    setView('day')
  }

  const shiftPicker = (dir: -1 | 1) =>
    setPicker((p) => new Date(p.getFullYear(), p.getMonth() + dir, 1))

  return (
    <div className="flex-1 min-h-0 flex bg-white overflow-hidden">
      <aside className="w-[280px] shrink-0 border-r border-gray-200 flex flex-col overflow-y-auto hover-scroll p-5 gap-6">
        <div>
          <div className="text-[11px] font-semibold text-gray-500">
            {`${WEEKDAYS_FULL[today.getDay()]}, ${MONTHS[today.getMonth()]} ${today.getDate()} ${today.getFullYear()}`}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">My Calendar</h2>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() => shiftPicker(-1)}
              className="p-1 rounded hover:bg-gray-100 text-gray-500 cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-bold text-gray-800">
              {MONTHS[picker.getMonth()]} {picker.getFullYear()}
            </span>
            <button
              type="button"
              onClick={() => shiftPicker(1)}
              className="p-1 rounded hover:bg-gray-100 text-gray-500 cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center">
            {WEEKDAYS.map((w) => (
              <span key={w} className="text-[10px] font-bold uppercase text-gray-400 py-1">
                {w.slice(0, 2)}
              </span>
            ))}
            {pickerCells.map((d) => {
              const isOther = d.getMonth() !== picker.getMonth()
              const isToday = sameDay(d, today)
              const isSel = sameDay(d, selected)
              return (
                <button
                  key={iso(d)}
                  type="button"
                  onClick={() => pickDay(d)}
                  className={`mx-auto w-7 h-7 flex items-center justify-center rounded-full text-[11px] cursor-pointer transition-colors ${
                    isToday
                      ? 'bg-blue-600 text-white font-bold'
                      : isSel
                        ? 'bg-blue-100 text-blue-700 font-bold'
                        : isOther
                          ? 'text-gray-300 hover:bg-gray-50'
                          : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <div className="text-[13px] font-bold text-gray-700 mb-2">Event List</div>
          <div className="flex flex-col gap-1">
            {CALENDAR_CATEGORIES.map((c) => {
              const on = active.has(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCategory(c.id)}
                  className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-md text-left transition-colors cursor-pointer ${
                    on ? 'hover:bg-gray-50' : 'opacity-45 hover:opacity-70'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.color }} />
                  <span className={`flex-1 text-[13px] ${on ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{c.label}</span>
                  <span className="text-[11px] font-semibold text-gray-400">{counts.get(c.id) ?? 0}</span>
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      <section className="flex-1 min-w-0 flex flex-col">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => go(-1)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 cursor-pointer"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-500 cursor-pointer"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={goToday}
              className="ml-1 px-3 py-1.5 rounded-md border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              today
            </button>
          </div>

          <h2 className="flex-1 text-center text-[15px] font-bold text-gray-900">{title}</h2>

          <div className="flex items-center gap-1 rounded-md border border-gray-200 p-0.5">
            {(['month', 'week', 'day', 'list'] as ViewMode[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={`px-3 py-1 rounded text-[12px] font-semibold capitalize cursor-pointer transition-colors ${
                  view === v ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {visible.length === 0 && view !== 'list' ? (
          <EmptyState />
        ) : view === 'month' ? (
          <MonthGrid cells={monthCells} refMonth={current} byDate={byDate} today={today} onSelect={selectEvent} />
        ) : view === 'list' ? (
          <ListView events={visible} onSelect={selectEvent} />
        ) : (
          <TimeGrid days={weekDays} byDate={byDate} today={today} onSelect={selectEvent} />
        )}
      </section>
    </div>
  )
}
