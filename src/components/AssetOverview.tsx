import { useState } from 'react'

function GaugeCard({
  title,
  value,
  unit,
  pillText,
  pillColor,
  pillBg,
  actual,
  design,
  trend,
  trendColor,
  arcEnd,
}: {
  title: string
  value: string
  unit: string
  pillText: string
  pillColor: string
  pillBg: string
  actual: string
  design: string
  trend: string
  trendColor: string
  arcEnd: { x: number; y: number }
}) {
  const bgArc = 'M 22.0 71.0 A 54 54 0 0 1 130.0 71.0'
  const valueArc = `M 22.0 71.0 A 54 54 0 0 1 ${arcEnd.x} ${arcEnd.y}`

  return (
    <div className="gauge-card">
      <div className="gauge-hdr">
        <span className="gauge-title">{title}</span>
        <span className="gauge-range">Last 7 Days ⌄</span>
      </div>
      <div className="gauge-body">
        <svg viewBox="0 0 152 82" width="152" height="82">
          <path d={bgArc} fill="none" stroke="var(--s4)" strokeWidth="9" strokeLinecap="round" />
          <path d={valueArc} fill="none" stroke={pillColor} strokeWidth="9" strokeLinecap="round" />
          <circle cx={arcEnd.x} cy={arcEnd.y} r="6" fill="#fff" stroke={pillColor} strokeWidth="3.5" />
        </svg>
        <div className="gauge-val">
          {value} <span style={{ fontSize: '12px', fontWeight: 500, color: '#9ca3af' }}>{unit}</span>
        </div>
        <div className="gauge-pill" style={{ background: pillBg, color: pillColor }}>
          {pillText}
        </div>
      </div>
      <div className="gauge-foot">
        <div>
          <div className="gf-l">Actual</div>
          <div className="gf-v">{actual}</div>
        </div>
        <div>
          <div className="gf-l">Design</div>
          <div className="gf-v">{design}</div>
        </div>
        <div>
          <div className="gf-l">Trend</div>
          <div className="gf-v" style={{ color: trendColor }}>{trend}</div>
        </div>
      </div>
    </div>
  )
}

function TrendChart({
  title,
  badge,
  stat1Label,
  stat1Color,
  stat1Value,
  stat2Label,
  stat2Color,
  stat2Value,
  line1Points,
  line2Points,
  days,
}: {
  title: string
  badge: string
  stat1Label: string
  stat1Color: string
  stat1Value: string
  stat2Label: string
  stat2Color: string
  stat2Value: string
  line1Points: string
  line2Points: string
  days: string[]
}) {
  return (
    <div className="apc-card">
      <div className="apc-hdr">
        <span className="apc-hdr-title">{title} ⌄</span>
        <span className="apc-badge">{badge}</span>
        <span className="apc-period" style={{ marginLeft: 8 }}>Last 7 Days ⌄</span>
      </div>
      <div className="apc-stats">
        <div>
          <div className="apc-stat-lbl">
            <span className="dot" style={{ background: stat1Color, width: 8, height: 8 }} />
            {stat1Label}
          </div>
          <div className="apc-stat-val">{stat1Value}</div>
        </div>
        <div>
          <div className="apc-stat-lbl">
            <span className="dot" style={{ background: stat2Color, width: 8, height: 8 }} />
            {stat2Label}
          </div>
          <div className="apc-stat-val">{stat2Value}</div>
        </div>
      </div>
      <svg viewBox="0 0 560 170" width="100%" height="170" preserveAspectRatio="none">
        {[0, 42.5, 85, 127.5, 170].map((y) => (
          <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="var(--s4)" strokeWidth="1" />
        ))}
        <polyline points={line1Points} fill="none" stroke={stat1Color} strokeWidth="2" />
        <polyline points={line2Points} fill="none" stroke={stat2Color} strokeWidth="2" strokeDasharray="4 3" />
      </svg>
      <div className="apc-days">
        {days.map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  )
}

function IncidentCard({
  isNew,
  title,
  date,
  severity,
  duration,
  impactItems,
}: {
  isNew?: boolean
  title: string
  date: string
  severity: string
  duration: string
  impactItems?: { label: string; value: string; delta: string }[]
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={`inc-card2${isNew ? ' is-new' : ''}`}>
      <div className="inc2-top">
        <div className="inc2-title-line">
          <span className="inc-dot cr" />
          <span className="inc2-title">{title}</span>
        </div>
        <span className="inc2-date">{date}</span>
      </div>
      <div className="inc2-meta-row">
        <span className="m">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M10 2v16M4 5.5l12 9M16 5.5l-12 9" strokeLinecap="round" />
          </svg>
          {severity}
        </span>
        <span className="m">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M5 3h10M5 17h10M6 3c0 4 3 4.5 4 5.5-1 1-4 1.5-4 5.5M14 3c0 4-3 4.5-4 5.5 1 1 4 1.5 4 5.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {duration}
        </span>
      </div>
      {impactItems && impactItems.length > 0 && (
        <>
          <div className="inc2-impact-row" onClick={() => setExpanded(!expanded)}>
            <span className="m">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M13.5 3.5a3.5 3.5 0 00-4.6 4.2L3.5 13a1.5 1.5 0 002.1 2.1l5.3-5.4a3.5 3.5 0 004.2-4.6l-2.3 2.3-1.7-.5-.5-1.7 2.3-2.3z" strokeLinejoin="round" strokeLinecap="round" />
              </svg>
              Impact
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.12s', flexShrink: 0 }}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
          {expanded && (
            <div className="inc2-impact-body fade-in">
              {impactItems.map((item) => (
                <div key={item.label} className="inc2-impact-item">
                  <span className="lbl">{item.label}</span>
                  <span className="val">
                    {item.value} <span className="tu">{item.delta}</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isNew && (
        <div className="inc2-badge">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 15L15 5M8 5h7v7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          New
        </div>
      )}
    </div>
  )
}

export default function AssetOverview({ rpCollapsed, onToggleRp }: { rpCollapsed: boolean; onToggleRp: () => void }) {
  const [rpTab, setRpTab] = useState<'incidents' | 'tasks'>('incidents')
  const [incFilter, setIncFilter] = useState('All')

  const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

  const superheatSubcooling1 = '0.0,88.6 29.5,104.0 58.9,130.0 88.4,147.9 117.9,86.3 147.4,49.3 176.8,64.7 206.3,63.6 235.8,104.8 265.3,155.9 294.7,121.5 324.2,86.1 353.7,74.2 383.2,38.6 412.6,65.4 442.1,130.7 471.6,129.6 501.1,122.6 530.5,110.2 560.0,47.0'
  const superheatSubcooling2 = '0.0,135.1 29.5,137.8 58.9,111.2 88.4,67.7 117.9,86.6 147.4,114.5 176.8,123.4 206.3,152.6 235.8,140.4 265.3,90.0 294.7,85.2 324.2,89.6 353.7,94.6 383.2,141.8 412.6,154.9 442.1,119.6 471.6,107.6 501.1,87.0 530.5,69.7 560.0,113.6'

  const specPowerCond1 = '0.0,61.9 29.5,39.0 58.9,93.3 88.4,140.9 117.9,123.6 147.4,119.7 176.8,88.5 206.3,32.4 235.8,59.0 265.3,103.5 294.7,112.3 324.2,143.4 353.7,128.0 383.2,58.7 412.6,52.6 442.1,67.9 471.6,75.4 501.1,133.5 530.5,151.3 560.0,98.5'
  const specPowerCond2 = '0.0,109.8 29.5,155.6 58.9,143.5 88.4,109.3 117.9,101.7 147.4,76.8 176.8,80.7 206.3,132.6 235.8,143.6 265.3,133.3 294.7,131.0 324.2,88.7 353.7,67.2 383.2,103.4 412.6,120.4 442.1,134.6 471.6,155.2 501.1,117.2 530.5,79.3 560.0,89.4'

  const incidents = [
    {
      title: 'Condenser Approach High',
      date: '15/06, 2PM',
      severity: 'Critical',
      duration: '2h 40m',
      isNew: true,
      impactItems: [
        { label: 'Compressor Load', value: '104 TPH', delta: '↓10%' },
        { label: 'CT Efficiency', value: '71%', delta: '↓9%' },
      ],
    },
    {
      title: 'Specific Power High',
      date: '15/06, 1PM',
      severity: 'Critical',
      duration: '3h 10m',
      isNew: false,
      impactItems: [],
    },
  ]

  const filteredIncidents = incFilter === 'All' ? incidents : incidents.filter((i) => i.severity === incFilter)

  return (
    <div className="flex gap-0 flex-1 min-h-0">
      {/* CENTER MAIN */}
      <div className="flex-1 min-w-0 overflow-y-auto pr-4">
        <div className="fade-in">
          {/* Asset Summary Card */}
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-xl px-5 py-3 flex items-center gap-0">
              <div className="flex flex-col items-center px-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Asset Type</span>
                <span className="text-[14px] font-bold text-gray-900 mt-0.5">📦 Chiller</span>
              </div>
              <span className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center px-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</span>
                <span className="text-[14px] font-bold text-gray-900 mt-0.5">On</span>
              </div>
              <span className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center px-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Uptime</span>
                <span className="text-[14px] font-bold text-gray-900 mt-0.5">
                  65% <span style={{ color: 'var(--gm)', fontSize: 12, fontWeight: 700 }}>↑ 5%</span>
                </span>
              </div>
              <span className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center px-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Risk Score</span>
                <span className="text-[14px] font-bold text-gray-900 mt-0.5">
                  87% <span style={{ color: 'var(--rm)', fontSize: 12, fontWeight: 700 }}>↑ 10%</span>
                </span>
              </div>
              <span className="w-px h-8 bg-gray-200" />
              <div className="flex flex-col items-center px-5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">KPIs</span>
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--rm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--rm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--rm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--aym)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--gm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--gm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--gm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--gm)' }} />
                  <span className="w-2 h-2 rounded-[2px]" style={{ background: 'var(--gm)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* KPI Section */}
          <div className="av-section-hdr">
            KPI <span className="av-section-count">(4)</span>
          </div>
          <div className="gauge-grid mb-5">
            <GaugeCard
              title="Condenser Approach"
              value="7.2"
              unit="°C"
              pillText="↑ 18% vs baseline"
              pillColor="var(--rm)"
              pillBg="var(--rbg)"
              actual="7.2 °C"
              design="7.2 °C"
              trend="↑ 18% vs baseline"
              trendColor="var(--rm)"
              arcEnd={{ x: 110.4, y: 29.4 }}
            />
            <GaugeCard
              title="Evaporator ΔT"
              value="3.2"
              unit="°C"
              pillText="↓ 12% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
              actual="3.2 °C"
              design="3.2 °C"
              trend="↓ 12% vs baseline"
              trendColor="var(--aym)"
              arcEnd={{ x: 72.6, y: 17.1 }}
            />
            <GaugeCard
              title="Specific Power"
              value="1.04"
              unit="kW/TR"
              pillText="↑ 10% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
              actual="1.04 kW/TR"
              design="1.04 kW/TR"
              trend="↑ 10% vs baseline"
              trendColor="var(--aym)"
              arcEnd={{ x: 59.3, y: 19.6 }}
            />
            <GaugeCard
              title="Superheat"
              value="18.4"
              unit="°C"
              pillText="↑ 9% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
              actual="18.4 °C"
              design="18.4 °C"
              trend="↑ 9% vs baseline"
              trendColor="var(--aym)"
              arcEnd={{ x: 53.0, y: 22.1 }}
            />
          </div>

          {/* Performance Trends */}
          <div className="av-section-hdr" style={{ marginTop: 20 }}>
            Performance Trends
          </div>
          <div className="apc-row">
            <TrendChart
              title="Superheat vs Subcooling"
              badge="Optimal"
              stat1Label="Superheat"
              stat1Color="#1565C0"
              stat1Value="-4.98 °C"
              stat2Label="Subcooling"
              stat2Color="#B23A5A"
              stat2Value="4.36 °C"
              line1Points={superheatSubcooling1}
              line2Points={superheatSubcooling2}
              days={days}
            />
            <TrendChart
              title="Specific Power vs Condenser Approach"
              badge="Optimal"
              stat1Label="Specific Power"
              stat1Color="#1565C0"
              stat1Value="2.78 kW/TR"
              stat2Label="Condenser Approach"
              stat2Color="#B23A5A"
              stat2Value="7.66 °C"
              line1Points={specPowerCond1}
              line2Points={specPowerCond2}
              days={days}
            />
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      {!rpCollapsed && (
        <div className="w-[320px] shrink-0 border-l border-t border-gray-200 bg-white flex flex-col min-h-0">
          <div className="rp-head">
            <div className="rp-title-row">
              <button className="rp-collapse-btn" onClick={onToggleRp} title="Collapse">
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3.5" width="14" height="13" rx="2" />
                  <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
                  <path d="M13 7.5l-2.5 2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="rp-heading">Incidents and Tasks</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
              <div className="rp-unit-wrap">
                <select className="rp-unit-select" disabled>
                  <option>Chiller 10</option>
                </select>
                <svg className="rp-unit-chevron" width="11" height="11" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="5 8 10 13 15 8" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="rp-tabs">
          <div
            className={`rpt${rpTab === 'incidents' ? ' active' : ''}`}
            onClick={() => setRpTab('incidents')}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M10 2c-1.2 1.2-1.6 2.4-1.5 3.6A5.5 5.5 0 005 11c0 4-1.5 5.5-1.5 5.5h13S15 15 15 11a5.5 5.5 0 00-3.5-5.4c.1-1.2-.3-2.4-1.5-3.6z" strokeLinejoin="round" />
              <path d="M8 16.5a2 2 0 004 0" strokeLinecap="round" />
            </svg>
            Incidents <span className="cnt">{incidents.length}</span>
          </div>
          <div
            className={`rpt${rpTab === 'tasks' ? ' active' : ''}`}
            onClick={() => setRpTab('tasks')}
          >
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="5" y="3" width="10" height="14" rx="1.5" />
              <path d="M8 3V2.5a1 1 0 011-1h2a1 1 0 011 1V3" strokeLinecap="round" />
              <path d="M7.5 8h5M7.5 11h5M7.5 14h3" strokeLinecap="round" />
            </svg>
            Tasks <span className="cnt">2</span>
          </div>
        </div>

        <div className="rp-body">
          {rpTab === 'incidents' && (
            <>
              <div className="qf-row" style={{ marginBottom: 12 }}>
                {['All', 'Critical', 'Warning', 'Deviation'].map((f) => (
                  <div
                    key={f}
                    className={`qf-chip${incFilter === f ? ' active' : ''}`}
                    onClick={() => setIncFilter(f)}
                  >
                    {f} <span className="qf-n">{f === 'All' ? incidents.length : incidents.filter((i) => i.severity === f).length}</span>
                  </div>
                ))}
              </div>
              <div className="fade-in">
                {filteredIncidents.map((inc) => (
                  <IncidentCard
                    key={inc.title}
                    isNew={inc.isNew}
                    title={inc.title}
                    date={inc.date}
                    severity={inc.severity}
                    duration={inc.duration}
                    impactItems={inc.impactItems}
                  />
                ))}
              </div>
            </>
          )}
          {rpTab === 'tasks' && (
            <div className="text-[12px] text-gray-400 text-center py-8">No tasks for this asset.</div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
