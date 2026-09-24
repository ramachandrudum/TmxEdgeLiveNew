type MiniLegend = { label: string; count: number; color: string }

type MiniCardData = {
  label: string
  total: number
  legends: MiniLegend[]
  legendColWidth?: number
}

const miniCards: MiniCardData[] = [
  {
    label: 'Assets',
    total: 10,
    legends: [
      { label: 'Critical', count: 3, color: 'var(--rm)' },
      { label: 'At Risk', count: 2, color: 'var(--aym)' },
      { label: 'Healthy', count: 5, color: 'var(--gm)' },
    ],
  },
  {
    label: 'Incidents',
    total: 7,
    legends: [
      { label: 'Critical', count: 3, color: 'var(--rm)' },
      { label: 'Warning', count: 3, color: 'var(--am)' },
      { label: 'Deviation', count: 1, color: '#F9A825' },
    ],
  },
  {
    label: 'Tasks',
    total: 5,
    legendColWidth: 45,
    legends: [
      { label: 'Overdue', count: 1, color: 'var(--rm)' },
      { label: 'Ongoing', count: 2, color: 'var(--aym)' },
      { label: 'Not Started', count: 1, color: 'var(--tt)' },
      { label: 'Completed', count: 1, color: 'var(--gm)' },
    ],
  },
]

function donutGradient(total: number, legends: MiniLegend[]): string {
  let acc = 0
  return legends
    .map((l) => {
      const deg = (l.count / total) * 360
      const stop = `${acc}deg ${acc + deg}deg`
      acc += deg
      return `${l.color} ${stop}`
    })
    .join(', ')
}

function MiniCard({ card }: { card: MiniCardData }) {
  const split = Math.ceil(card.legends.length / 2)
  const col1 = card.legends.slice(0, split)
  const col2 = card.legends.slice(split)
  const splitWidth = card.legendColWidth ? { width: card.legendColWidth } : undefined

  return (
    <div className="ov-mini-card">
      <div className="ov-mini-num">
        <span>{card.label}</span>
        <b>{card.total}</b>
      </div>
      <div className="ov-mini-body">
        <div className="ov-mini-legend2col">
          <div className="ov-mini-legend-col" style={splitWidth}>
            {col1.map((l) => (
              <div key={l.label}>
                <span className="sq" style={{ background: l.color }} />
                {l.label} <b>{l.count}</b>
              </div>
            ))}
          </div>
          <div className="ov-mini-legend-col" style={splitWidth}>
            {col2.map((l) => (
              <div key={l.label}>
                <span className="sq" style={{ background: l.color }} />
                {l.label} <b>{l.count}</b>
              </div>
            ))}
          </div>
        </div>
        <div
          className="ov-donut"
          style={{ background: `conic-gradient(${donutGradient(card.total, card.legends)})` }}
        />
      </div>
    </div>
  )
}

export default function OverviewMiniStack() {
  return (
    <div className="ov-mini-stack">
      {miniCards.map((card) => (
        <MiniCard key={card.label} card={card} />
      ))}
    </div>
  )
}