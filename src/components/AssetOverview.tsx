import { kpis } from '../data/dashboardPage'

function Sparkline({ color, path }: { color: string; path: string }) {
  return (
    <svg viewBox="0 0 220 26" preserveAspectRatio="none" className="w-full h-[26px] block">
      <path d={`${path} L220,26 L0,26 Z`} fill={color} opacity="0.15" />
      <path d={path} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="miter" />
    </svg>
  )
}

function GaugeCard({
  title,
  value,
  unit,
  segments,
  thresholds,
  pillText,
  pillColor,
  pillBg,
}: {
  title: string
  value: string
  unit: string
  segments: { from: number; to: number; color: string }[]
  thresholds: { angle: number; label: string }[]
  pillText: string
  pillColor: string
  pillBg: string
}) {
  const svgR = 105
  const innerR = 78
  const cx = 120
  const cy = 115

  const donutPath = (rO: number, rI: number, startDeg: number, endDeg: number) => {
    const sO = (Math.PI / 180) * startDeg
    const eO = (Math.PI / 180) * endDeg
    const sI = (Math.PI / 180) * startDeg
    const eI = (Math.PI / 180) * endDeg
    const ox1 = cx + rO * Math.cos(sO)
    const oy1 = cy - rO * Math.sin(sO)
    const ox2 = cx + rO * Math.cos(eO)
    const oy2 = cy - rO * Math.sin(eO)
    const ix1 = cx + rI * Math.cos(eI)
    const iy1 = cy - rI * Math.sin(eI)
    const ix2 = cx + rI * Math.cos(sI)
    const iy2 = cy - rI * Math.sin(sI)
    const large = endDeg - startDeg > 180 ? 1 : 0
    return `M${ox1},${oy1} A${rO},${rO} 0 ${large},1 ${ox2},${oy2} L${ix1},${iy1} A${rI},${rI} 0 ${large},0 ${ix2},${iy2} Z`
  }

  return (
    <div className="gauge-card">
      <div className="gauge-hdr">
        <span className="gauge-title">{title}</span>
        <span className="gauge-range">Last 7 Days ⌄</span>
      </div>
      <div className="gauge-body">
        <svg viewBox="0 0 240 140" width="220" height="130" style={{ overflow: 'visible' }}>
          <g>
            {segments.map((seg, i) => (
              <path key={i} d={donutPath(svgR, innerR, seg.from, seg.to)} fill={seg.color} />
            ))}
            <path d={`M${cx - svgR},${cy} A${svgR},${svgR} 0 0,1 ${cx + svgR},${cy}`} fill="none" stroke="lightgray" strokeWidth="0" />
            <path d={`M${cx - svgR},${cy} A${svgR},${svgR} 0 0,1 ${cx + svgR},${cy} L${cx + innerR},${cy} A${innerR},${innerR} 0 0,0 ${cx - innerR},${cy} Z`} fill="lightgray" />
            {segments.map((seg, i) => (
              <path key={`inner-${i}`} d={donutPath(svgR, innerR, seg.from, seg.to)} fill={seg.color} />
            ))}
            {thresholds.map((t, i) => {
              const rad = (Math.PI / 180) * t.angle
              const tx1 = cx + (svgR + 2) * Math.cos(rad)
              const ty1 = cy - (svgR + 2) * Math.sin(rad)
              const tx2 = cx + (svgR + 10) * Math.cos(rad)
              const ty2 = cy - (svgR + 10) * Math.sin(rad)
              const lx = cx + (svgR + 16) * Math.cos(rad)
              const ly = cy - (svgR + 16) * Math.sin(rad)
              const rot = t.angle > 90 && t.angle < 270 ? t.angle - 180 : t.angle
              return (
                <g key={i}>
                  <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#333" strokeWidth="1" />
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={t.angle === 0 ? 'start' : t.angle === 180 ? 'end' : 'middle'}
                    dominantBaseline="middle"
                    fontSize="10"
                    fill="#333"
                    transform={t.angle !== 0 && t.angle !== 180 ? `rotate(${rot}, ${lx}, ${ly})` : undefined}
                  >
                    {t.label}
                  </text>
                </g>
              )
            })}
            <text x={cx} y={cy - 2} textAnchor="middle" fontSize="22" fontWeight="900" fill="#111827" style={{ stroke: 'none' }}>
              {value}
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="500" fill={pillColor}>
              {unit}
            </text>
          </g>
        </svg>
        <div className="gauge-pill" style={{ background: pillBg, color: pillColor }}>
          {pillText}
        </div>
      </div>
      <div className="gauge-title-bottom">{title}</div>
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

export default function AssetOverview() {
  const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun']

  const superheatSubcooling1 = '0.0,88.6 29.5,104.0 58.9,130.0 88.4,147.9 117.9,86.3 147.4,49.3 176.8,64.7 206.3,63.6 235.8,104.8 265.3,155.9 294.7,121.5 324.2,86.1 353.7,74.2 383.2,38.6 412.6,65.4 442.1,130.7 471.6,129.6 501.1,122.6 530.5,110.2 560.0,47.0'
  const superheatSubcooling2 = '0.0,135.1 29.5,137.8 58.9,111.2 88.4,67.7 117.9,86.6 147.4,114.5 176.8,123.4 206.3,152.6 235.8,140.4 265.3,90.0 294.7,85.2 324.2,89.6 353.7,94.6 383.2,141.8 412.6,154.9 442.1,119.6 471.6,107.6 501.1,87.0 530.5,69.7 560.0,113.6'

  const specPowerCond1 = '0.0,61.9 29.5,39.0 58.9,93.3 88.4,140.9 117.9,123.6 147.4,119.7 176.8,88.5 206.3,32.4 235.8,59.0 265.3,103.5 294.7,112.3 324.2,143.4 353.7,128.0 383.2,58.7 412.6,52.6 442.1,67.9 471.6,75.4 501.1,133.5 530.5,151.3 560.0,98.5'
  const specPowerCond2 = '0.0,109.8 29.5,155.6 58.9,143.5 88.4,109.3 117.9,101.7 147.4,76.8 176.8,80.7 206.3,132.6 235.8,143.6 265.3,133.3 294.7,131.0 324.2,88.7 353.7,67.2 383.2,103.4 412.6,120.4 442.1,134.6 471.6,155.2 501.1,117.2 530.5,79.3 560.0,89.4'

  return (
    <div className="flex gap-0 flex-1 min-h-0">
      {/* CENTER MAIN */}
      <div className="flex-1 min-w-0 overflow-y-auto pr-4">
        <div className="fade-in">
          {/* Asset Summary Card */}
          <div className="mb-4">
            <div className="bg-white border border-gray-200 rounded-md px-5 py-3 flex items-center gap-0">
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

          {/* Consumption KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-5 shrink-0">
            {kpis.map((k) => (
              <div key={k.label} className="bg-white border border-gray-200 rounded-md pt-3 px-4 overflow-hidden flex flex-col">
                <div className="text-[11px] font-semibold text-gray-500">{k.label}</div>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-bold text-gray-900">
                    {k.value}
                    <span className="text-[11px] font-medium text-gray-400 ml-0.5">{k.unit}</span>
                  </span>
                  <span className="text-[11px] font-bold" style={{ color: k.deltaColor }}>{k.delta}</span>
                </div>
                <div className="mt-2 -mx-4">
                  <Sparkline color={k.color} path={k.path} />
                </div>
              </div>
            ))}
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
              segments={[
                { from: 0, to: 90, color: '#E65900' },
                { from: 90, to: 155, color: '#0A6347' },
                { from: 155, to: 180, color: '#E65900' },
              ]}
              thresholds={[
                { angle: 0, label: '0' },
                { angle: 60, label: '4' },
                { angle: 130, label: '8' },
                { angle: 180, label: '10' },
              ]}
              pillText="↑ 18% vs baseline"
              pillColor="var(--rm)"
              pillBg="var(--rbg)"
            />
            <GaugeCard
              title="Evaporator ΔT"
              value="3.2"
              unit="°C"
              segments={[
                { from: 0, to: 50, color: '#0A6347' },
                { from: 50, to: 130, color: '#E65900' },
                { from: 130, to: 180, color: '#0A6347' },
              ]}
              thresholds={[
                { angle: 0, label: '0' },
                { angle: 60, label: '2' },
                { angle: 120, label: '5' },
                { angle: 180, label: '7' },
              ]}
              pillText="↓ 12% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
            />
            <GaugeCard
              title="Specific Power"
              value="1.04"
              unit="kW/TR"
              segments={[
                { from: 0, to: 70, color: '#E65900' },
                { from: 70, to: 140, color: '#0A6347' },
                { from: 140, to: 180, color: '#E65900' },
              ]}
              thresholds={[
                { angle: 0, label: '0' },
                { angle: 60, label: '0.5' },
                { angle: 120, label: '1.5' },
                { angle: 180, label: '2.0' },
              ]}
              pillText="↑ 10% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
            />
            <GaugeCard
              title="Superheat"
              value="18.4"
              unit="°C"
              segments={[
                { from: 0, to: 40, color: '#0A6347' },
                { from: 40, to: 100, color: '#E65900' },
                { from: 100, to: 180, color: '#0A6347' },
              ]}
              thresholds={[
                { angle: 0, label: '0' },
                { angle: 60, label: '10' },
                { angle: 120, label: '20' },
                { angle: 180, label: '30' },
              ]}
              pillText="↑ 9% vs baseline"
              pillColor="var(--aym)"
              pillBg="var(--aybg)"
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
              stat1Color="#0968db"
              stat1Value="-4.98 °C"
              stat2Label="Subcooling"
              stat2Color="#0968db"
              stat2Value="4.36 °C"
              line1Points={superheatSubcooling1}
              line2Points={superheatSubcooling2}
              days={days}
            />
            <TrendChart
              title="Specific Power vs Condenser Approach"
              badge="Optimal"
              stat1Label="Specific Power"
              stat1Color="#0968db"
              stat1Value="2.78 kW/TR"
              stat2Label="Condenser Approach"
              stat2Color="#0968db"
              stat2Value="7.66 °C"
              line1Points={specPowerCond1}
              line2Points={specPowerCond2}
              days={days}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
