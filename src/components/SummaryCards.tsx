import { getCustomerSummary } from '../data/dashboard'

type Legend = { label: string; value: string; color: string }

type Card = {
  key: string
  num: string
  label: string
  caption?: string
  bars: { width: number; color: string }[]
  legends: Legend[]
  legends2?: Legend[]
}

export default function SummaryCards({ active }: { active: string }) {
  const s = getCustomerSummary(active)
  const pct = (part: number, total: number) => (total > 0 ? (part / total) * 100 : 0)
  const isAll = active === 'all'

  const cards: Card[] = [
    {
      key: 'sites',
      num: String(isAll ? s.customers : s.sites),
      label: isAll ? 'Customers' : 'Sites',
      caption: `${s.sites} sites · ${s.units} units`,
      bars: [
        { width: pct(s.unitsOffline, s.units), color: 'var(--rm)' },
        { width: pct(s.unitsOnline, s.units), color: 'var(--gm)' },
      ],
      legends: [{ label: 'Offline', value: String(s.unitsOffline), color: 'var(--rm)' }],
      legends2: [{ label: 'Online', value: String(s.unitsOnline), color: 'var(--gm)' }],
    },
    {
      key: 'assets',
      num: String(s.assets),
      label: 'Assets',
      bars: [
        { width: pct(s.assetHealth.critical, s.assets), color: 'var(--rm)' },
        { width: pct(s.assetHealth.atRisk, s.assets), color: 'var(--aym)' },
        { width: pct(s.assetHealth.healthy, s.assets), color: 'var(--gm)' },
      ],
      legends: [
        { label: 'Critical', value: String(s.assetHealth.critical), color: 'var(--rm)' },
        { label: 'At Risk', value: String(s.assetHealth.atRisk), color: 'var(--aym)' },
      ],
      legends2: [{ label: 'Healthy', value: String(s.assetHealth.healthy), color: 'var(--gm)' }],
    },
    {
      key: 'incidents',
      num: String(s.incidents),
      label: 'Incidents',
      bars: [
        { width: pct(s.incidentsBreakdown.critical, s.incidents), color: 'var(--rm)' },
        { width: pct(s.incidentsBreakdown.warning, s.incidents), color: 'var(--am)' },
        { width: pct(s.incidentsBreakdown.deviation, s.incidents), color: '#F9A825' },
      ],
      legends: [
        { label: 'Critical', value: String(s.incidentsBreakdown.critical), color: 'var(--rm)' },
        { label: 'Warning', value: String(s.incidentsBreakdown.warning), color: 'var(--am)' },
      ],
      legends2: [
        {
          label: 'Deviation',
          value: String(s.incidentsBreakdown.deviation),
          color: '#F9A825',
        },
      ],
    },
    {
      key: 'tasks',
      num: String(s.tasks),
      label: 'Tasks',
      bars: [
        { width: pct(s.tasksBreakdown.overdue, s.tasks), color: 'var(--rm)' },
        { width: pct(s.tasksBreakdown.ongoing, s.tasks), color: 'var(--am)' },
        { width: pct(s.tasksBreakdown.notStarted, s.tasks), color: 'var(--tt)' },
        { width: pct(s.tasksBreakdown.completed, s.tasks), color: 'var(--gm)' },
      ],
      legends: [
        { label: 'Overdue', value: String(s.tasksBreakdown.overdue), color: 'var(--rm)' },
        { label: 'Ongoing', value: String(s.tasksBreakdown.ongoing), color: 'var(--am)' },
      ],
      legends2: [
        { label: 'Not Started', value: String(s.tasksBreakdown.notStarted), color: 'var(--tt)' },
        { label: 'Completed', value: String(s.tasksBreakdown.completed), color: 'var(--gm)' },
      ],
    },
  ]

  const renderLegend = (items: Legend[]) => (
    <div className="hs5-legend-col space-y-1">
      {items.map((l) => (
        <div key={l.label} className="flex items-center gap-1.5">
          <span className="sq w-2 h-2 rounded-full" style={{ background: l.color }} />
          <span className="text-[10px] text-gray-600">
            {l.label}
            <b className="text-gray-900 ml-1">{l.value}</b>
          </span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="hs5-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.key} className="hs5-card bg-white border border-gray-200 rounded-xl p-4">
          {card.caption ? (
            <div className="hs5-top hs5-top-spread flex items-start justify-between gap-2">
              <span className="hs5-numlabel flex items-baseline gap-1.5">
                <span className="hs5-num text-3xl font-bold text-gray-900">{card.num}</span>
                <span className="hs5-label text-xs text-gray-600">{card.label}</span>
              </span>
              <span className="hs5-siteunit-caption-inline text-right text-[10px] text-gray-500">
                {card.caption}
              </span>
            </div>
          ) : (
            <div className="hs5-top flex items-baseline gap-1.5">
              <span className="hs5-num text-3xl font-bold text-gray-900">{card.num}</span>
              <span className="hs5-label text-xs text-gray-600">{card.label}</span>
            </div>
          )}

          <div className="hs5-bar flex h-2 rounded-full overflow-hidden bg-gray-100 mt-3">
            {card.bars.map((b, i) => (
              <span key={i} style={{ width: `${b.width}%`, background: b.color }} />
            ))}
          </div>

          <div className="hs5-legend mt-2 flex gap-6">
            {renderLegend(card.legends)}
            {card.legends2 && renderLegend(card.legends2)}
          </div>
        </div>
      ))}
    </div>
  )
}
