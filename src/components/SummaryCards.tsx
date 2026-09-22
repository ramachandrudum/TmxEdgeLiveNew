import { getCustomerSummary } from '../data/dashboard'

type Legend = { label: string; value: number; color: string; hideValue?: boolean }
type Card = {
  key: string
  num: string
  label: string
  caption?: string
  legends: Legend[]
}

function Donut({ legends, size = 65, stroke = 10 }: { legends: Legend[]; size?: number; stroke?: number }) {
  const total = legends.reduce((a, l) => a + l.value, 0)
  const r = (size - stroke) / 2
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
      {total > 0 && legends.map((l) => {
        const pct = l.value / total
        const dash = pct * circ
        const o = offset
        offset += dash
        return (
          <circle
            key={l.label}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={l.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-o}
          />
        )
      })}
    </svg>
  )
}

function Pie({ legends, size = 65 }: { legends: Legend[]; size?: number }) {
  const total = legends.reduce((a, l) => a + l.value, 0)
  const cx = size / 2, cy = size / 2, r = size / 2
  let cum = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {total > 0 && legends.map((l) => {
        const start = (cum / total) * 2 * Math.PI - Math.PI / 2
        cum += l.value
        const end = (cum / total) * 2 * Math.PI - Math.PI / 2
        const large = l.value / total > 0.5 ? 1 : 0
        const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end)
        return (
          <path
            key={l.label}
            d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`}
            fill={l.color}
          />
        )
      })}
    </svg>
  )
}

function Bars({ legends, width = 130 }: { legends: Legend[]; width?: number }) {
  const max = Math.max(...legends.map((l) => l.value), 1)
  return (
    <svg width={width} height={65} viewBox={`0 0 ${width} 65`} className="shrink-0">
      {legends.map((l, i) => {
        const barH = 14
        const gap = 6
        const y = i * (barH + gap) + 2
        const w = Math.max((l.value / max) * (width - 30), 4)
        return (
          <g key={l.label}>
            <rect x={0} y={y} width={w} height={barH} rx={2} fill={l.color} />
            <text x={w + 5} y={y + barH - 2} className="fill-gray-500" fontSize={9}>{l.value}</text>
          </g>
        )
      })}
    </svg>
  )
}

export default function SummaryCards({ active, variant = '' }: { active: string; variant?: string }) {
  const s = getCustomerSummary(active, variant)
  const isAll = active === 'all'

  const cards: Card[] = [
    {
      key: 'sites',
      num: String(isAll ? s.customers : s.sites),
      label: isAll ? 'Customers' : 'Sites',
      caption: `${s.sites} sites · ${s.units} units`,
      legends: [
        { label: 'Offline', value: s.unitsOffline, color: '#dc3545' },
        { label: 'Online', value: s.unitsOnline, color: '#28a745' },
      ],
    },
    {
      key: 'assets',
      num: String(s.assets),
      label: 'Assets',
      legends: [
        { label: 'Critical', value: s.assetHealth.critical, color: '#dc3545', hideValue: true },
        { label: 'At Risk', value: s.assetHealth.atRisk, color: '#ffc107', hideValue: true },
        { label: 'Healthy', value: s.assetHealth.healthy, color: '#28a745', hideValue: true },
      ],
    },
    {
      key: 'incidents',
      num: String(s.incidents),
      label: 'Incidents',
      legends: [
        { label: 'Critical', value: s.incidentsBreakdown.critical, color: '#dc3545' },
        { label: 'Warning', value: s.incidentsBreakdown.warning, color: '#fd7e14' },
        { label: 'Deviation', value: s.incidentsBreakdown.deviation, color: '#ffc107' },
      ],
    },
    {
      key: 'tasks',
      num: String(s.tasks),
      label: 'Tasks',
      legends: [
        { label: 'Overdue', value: s.tasksBreakdown.overdue, color: '#dc3545' },
        { label: 'Ongoing', value: s.tasksBreakdown.ongoing, color: '#fd7e14' },
        { label: 'Not Started', value: s.tasksBreakdown.notStarted, color: '#6c757d' },
        { label: 'Completed', value: s.tasksBreakdown.completed, color: '#28a745' },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.key} className="bg-white border border-gray-200 rounded-md p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-gray-900">{card.num}</span>
                <span className="text-xs text-gray-600 font-semibold">{card.label}</span>
              </div>
              {card.caption && (
                <span className="text-[10px] text-gray-500 block mb-1">{card.caption}</span>
              )}
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {card.legends.map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: l.color }} />
                    <span className="text-[11px] text-gray-600 truncate">{l.label}</span>
                    {!l.hideValue && (
                      <span className="text-[11px] font-semibold text-gray-900">{l.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 pt-1">
              {card.key === 'sites' && <Donut legends={card.legends} />}
              {card.key === 'assets' && <Bars legends={card.legends} />}
              {card.key === 'incidents' && <Pie legends={card.legends} />}
              {card.key === 'tasks' && <Donut legends={card.legends} />}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
