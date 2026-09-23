import { getCustomerSummary } from '../data/dashboard'

type Legend = { label: string; value: number; color: string; hideValue?: boolean }
type Card = {
  key: string
  num: string
  label: string
  caption?: string
  legends: Legend[]
  icon: React.ReactNode
  iconBg: string
}

function Pie({ legends, size = 60 }: { legends: Legend[]; size?: number }) {
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

function Pyramid({ legends }: { legends: Legend[] }) {
  const w = 60
  const h = 60
  const rows = legends.length
  const rowH = h / rows
  const maxVal = Math.max(...legends.map((l) => l.value), 1)
  const reversed = legends.slice().reverse()

  const getWidth = (val: number) => Math.max((val / maxVal) * w, 10)

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      {reversed.map((l, i) => {
        const ri = rows - 1 - i
        const y = ri * rowH
        const topW = i < rows - 1 ? getWidth(reversed[i + 1].value) : getWidth(l.value) * 0.4
        const botW = getWidth(l.value)
        const topX = (w - topW) / 2
        const botX = (w - botW) / 2
        return (
          <polygon
            key={l.label}
            points={`${topX},${y} ${topX + topW},${y} ${botX + botW},${y + rowH} ${botX},${y + rowH}`}
            fill={l.color}
          />
        )
      })}
    </svg>
  )
}

function VBars({ legends, maxH = 50 }: { legends: Legend[]; maxH?: number }) {
  const sorted = [...legends].sort((a, b) => b.value - a.value)
  const maxVal = Math.max(...sorted.map((l) => l.value), 1)
  const gap = 4
  const totalW = 50
  const barW = (totalW - (sorted.length - 1) * gap) / sorted.length

  return (
    <div className="shrink-0 flex flex-col items-center">
      <svg width={totalW} height={maxH} viewBox={`0 0 ${totalW} ${maxH}`}>
        {sorted.map((l, i) => {
          const h = Math.max((l.value / maxVal) * maxH, 4)
          const x = i * (barW + gap)
          const y = maxH - h
          return (
            <rect key={l.label} x={x} y={y} width={barW} height={h} rx={2} fill={l.color} />
          )
        })}
      </svg>
      <div className="flex" style={{ gap }}>
        {sorted.map((l) => (
          <div key={l.label} className="flex flex-col items-center" style={{ width: barW }}>
            <span className="text-[9px] font-bold text-gray-900">{l.value}</span>
          </div>
        ))}
      </div>
    </div>
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
      iconBg: 'bg-blue-50',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      key: 'assets',
      num: String(s.assets),
      label: 'Assets',
      legends: [
        { label: 'Critical', value: s.assetHealth.critical, color: '#dc3545' },
        { label: 'At Risk', value: s.assetHealth.atRisk, color: '#ffc107' },
        { label: 'Healthy', value: s.assetHealth.healthy, color: '#28a745' },
      ],
      iconBg: 'bg-purple-50',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
          <rect x="2" y="6" width="20" height="12" rx="2" />
          <path d="M12 12h.01" />
          <path d="M17 12h.01" />
          <path d="M7 12h.01" />
        </svg>
      ),
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
      iconBg: 'bg-red-50',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      ),
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
      iconBg: 'bg-amber-50',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.key} className="bg-white border border-gray-200 rounded-md p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-start gap-1.5 border-r border-gray-200 pr-3 self-stretch">
                <span className={`inline-flex items-center justify-center w-[22px] h-[22px] rounded shrink-0 ${card.iconBg}`}>
                  {card.icon}
                </span>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-gray-900 leading-tight">{card.num}</span>
                  <span className="text-xs text-gray-600 font-semibold">{card.label}</span>
                </div>
              </div>
              <div className="shrink-0 pt-1 ml-auto">
                {card.key === 'sites' && <VBars legends={card.legends} />}
                {card.key === 'assets' && <Pyramid legends={card.legends} />}
                {card.key === 'incidents' && <Pie legends={card.legends} />}
                {card.key === 'tasks' && <VBars legends={card.legends} />}
              </div>
              <div className="flex flex-col gap-px">
                {card.legends.map((l) => (
                  <div key={l.label} className="flex items-center gap-1">
                    <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: l.color }} />
                    <span className="text-[11px] text-gray-600 whitespace-nowrap">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
      ))}
    </div>
  )
}
