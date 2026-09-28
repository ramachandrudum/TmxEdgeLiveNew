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

function Donut({ legends, size = 60, thickness = 12 }: { legends: Legend[]; size?: number; thickness?: number }) {
  const total = legends.reduce((a, l) => a + l.value, 0)
  const cx = size / 2
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r

  if (total <= 0) {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#e5e7eb" strokeWidth={thickness} />
      </svg>
    )
  }

  const segments = legends.reduce<{ legend: Legend; start: number }[]>((out, l) => {
    const prev = out[out.length - 1]
    const start = prev ? prev.start + prev.legend.value / total : 0
    if (l.value > 0) out.push({ legend: l, start })
    return out
  }, [])

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      {segments.map(({ legend, start }) => (
        <circle
          key={legend.label}
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke={legend.color}
          strokeWidth={thickness}
          strokeDasharray={`${(legend.value / total) * c} ${c}`}
          strokeDashoffset={-start * c}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      ))}
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
      iconBg: 'theme-primary-bg-soft',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-primary-text">
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
      iconBg: 'theme-status-info-soft',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-status-info-text">
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
      iconBg: 'theme-status-critical-soft',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-status-critical-text">
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
      iconBg: 'theme-status-warning-soft',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="theme-status-warning-text">
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
                {card.key === 'assets' && <Donut legends={card.legends} />}
                {card.key === 'incidents' && <Donut legends={card.legends} />}
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
