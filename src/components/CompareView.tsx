import { ArrowLeft, ChevronLeft, ChevronRight, Maximize2, Plus, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'

type Props = {
  compareType: string
  items: string[]
  onBack: () => void
  onAddMore: () => void
  onReset: () => void
}

const metrics = ['Level', 'Active Incidents', 'At Risk', 'Availability', 'Total Assets', 'Offline', 'Critical', 'Warning', 'Healthy']

const mockData: Record<string, { level: string; incidents: number; atRisk: number; availability: number; totalAssets: number; offline: number; critical: number; warning: number; healthy: number; color: string }> = {
  'COMPRESSOR': { level: 'Equipment', incidents: 4, atRisk: 1, availability: 96.3, totalAssets: 0, offline: 0, critical: 1, warning: 1, healthy: 0, color: '#7C3AED' },
  'ABSORBER': { level: 'Equipment', incidents: 2, atRisk: 1, availability: 95.7, totalAssets: 0, offline: 0, critical: 1, warning: 1, healthy: 0, color: '#7C3AED' },
  'HVAC': { level: 'Unit', incidents: 6, atRisk: 2, availability: 94.5, totalAssets: 12, offline: 1, critical: 2, warning: 3, healthy: 7, color: '#2563EB' },
  'Compressors': { level: 'Unit', incidents: 3, atRisk: 1, availability: 97.2, totalAssets: 8, offline: 0, critical: 1, warning: 1, healthy: 6, color: '#2563EB' },
  'Nestle UAE': { level: 'Site', incidents: 10, atRisk: 3, availability: 93.8, totalAssets: 20, offline: 2, critical: 3, warning: 4, healthy: 13, color: '#006D4E' },
  'Cairo Plant': { level: 'Site', incidents: 8, atRisk: 2, availability: 95.1, totalAssets: 18, offline: 1, critical: 2, warning: 3, healthy: 12, color: '#006D4E' },
  'Lagos Plant': { level: 'Site', incidents: 5, atRisk: 1, availability: 96.7, totalAssets: 15, offline: 0, critical: 1, warning: 2, healthy: 12, color: '#006D4E' },
  'Riyadh Plant': { level: 'Site', incidents: 7, atRisk: 2, availability: 94.9, totalAssets: 16, offline: 1, critical: 2, warning: 2, healthy: 11, color: '#006D4E' },
  'Primary Cooling Water System': { level: 'System', incidents: 4, atRisk: 1, availability: 96.3, totalAssets: 6, offline: 0, critical: 1, warning: 1, healthy: 4, color: '#DC2626' },
  'Secondary Cooling Water System': { level: 'System', incidents: 2, atRisk: 0, availability: 98.1, totalAssets: 3, offline: 0, critical: 0, warning: 1, healthy: 2, color: '#DC2626' },
  'Cooling Water Condensor': { level: 'System', incidents: 0, atRisk: 0, availability: 100, totalAssets: 2, offline: 0, critical: 0, warning: 0, healthy: 2, color: '#DC2626' },
  'Compressor System 1': { level: 'System', incidents: 2, atRisk: 1, availability: 97.2, totalAssets: 4, offline: 0, critical: 1, warning: 0, healthy: 3, color: '#DC2626' },
  'Compressor System 2': { level: 'System', incidents: 1, atRisk: 0, availability: 98.5, totalAssets: 2, offline: 0, critical: 0, warning: 1, healthy: 1, color: '#DC2626' },
  'Chiller 10': { level: 'Asset', incidents: 2, atRisk: 1, availability: 96.3, totalAssets: 0, offline: 0, critical: 1, warning: 0, healthy: 0, color: '#7C3AED' },
  'Chiller 20': { level: 'Asset', incidents: 1, atRisk: 0, availability: 97.8, totalAssets: 0, offline: 0, critical: 0, warning: 1, healthy: 0, color: '#7C3AED' },
  'Chiller 30': { level: 'Asset', incidents: 0, atRisk: 0, availability: 99.1, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' },
  'Cooling Tower A': { level: 'Asset', incidents: 1, atRisk: 0, availability: 95.5, totalAssets: 0, offline: 0, critical: 1, warning: 0, healthy: 0, color: '#7C3AED' },
  'Cooling Tower B': { level: 'Asset', incidents: 0, atRisk: 0, availability: 98.9, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' },
  'Primary Pump 1': { level: 'Asset', incidents: 0, atRisk: 0, availability: 99.5, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' },
  'Pump 3': { level: 'Asset', incidents: 1, atRisk: 0, availability: 97.2, totalAssets: 0, offline: 0, critical: 0, warning: 1, healthy: 0, color: '#7C3AED' },
  'Compressor 1': { level: 'Asset', incidents: 0, atRisk: 0, availability: 99.8, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' },
  'Compressor 2': { level: 'Asset', incidents: 1, atRisk: 1, availability: 95.2, totalAssets: 0, offline: 0, critical: 1, warning: 0, healthy: 0, color: '#7C3AED' },
  'Compressor 3': { level: 'Asset', incidents: 0, atRisk: 0, availability: 98.7, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' },
}

function SparkArea({ color }: { color: string }) {
  const points = Array.from({ length: 20 }, (_, i) => {
    const x = (i / 19) * 215
    const y = 10 + Math.sin(i * 0.5) * 12 + Math.random() * 8
    return `${x},${y}`
  }).join(' ')
  const areaPoints = `0,48 ${points} 215,48`
  return (
    <svg viewBox="0 0 215 48" className="w-full h-12">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#spark-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" />
    </svg>
  )
}

export default function CompareView({ compareType, items, onBack, onAddMore, onReset }: Props) {
  const [removed, setRemoved] = useState<string[]>([])
  const visible = items.filter((i) => !removed.includes(i))
  const typeLabel = compareType === 'site' ? 'Sites' : compareType === 'unit' ? 'Units' : compareType === 'system' ? 'Systems' : 'Equipments'

  return (
    <div className="flex-1 bg-white overflow-y-auto min-h-0">
      <div className="p-4 lg:p-6 pb-8 w-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Compare {typeLabel}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{visible.length} items · {typeLabel.slice(0, -1)} comparison</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
              <Maximize2 className="w-3 h-3" />
              Full Screen
            </button>
            <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
              <ArrowLeft className="w-3 h-3" />
              Back
            </button>
            <button onClick={onAddMore} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="w-3 h-3" />
              Add More
            </button>
            <button onClick={onReset} className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-gray-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-all cursor-pointer">
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>
        </div>

        <section className="border border-gray-200 bg-white">
          <div className="flex relative">
            <div className="w-[140px] shrink-0 bg-gray-50 border-r border-gray-200 z-10 sticky left-0">
              <div className="h-[136px] flex items-end justify-between px-4 pb-3 border-b border-gray-200">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Metrics</span>
              </div>
              <ul>
                {metrics.map((m) => (
                  <li key={m} className="h-[54px] flex items-center px-4 border-b border-gray-200 text-xs font-semibold text-gray-600">{m}</li>
                ))}
              </ul>
            </div>

            <div className="flex-1 overflow-x-auto">
              <div className="flex">
                {visible.map((name) => {
                  const d = mockData[name] ?? { level: compareType, incidents: 0, atRisk: 0, availability: 0, totalAssets: 0, offline: 0, critical: 0, warning: 0, healthy: 0, color: '#7C3AED' }
                  return (
                    <div key={name} className="w-[240px] shrink-0 flex flex-col border-r border-gray-200">
                      <div className="h-[136px] px-3 pt-2 pb-3 border-b border-gray-200 relative">
                        <button onClick={() => setRemoved((r) => [...r, name])} title={`Remove ${name}`} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-md text-gray-300 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                        <SparkArea color={d.color} />
                        <div className="flex items-center gap-1.5 mt-1 min-w-0">
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                          <h3 className="text-xs font-bold text-gray-900 truncate flex-1">{name}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${d.color}15`, color: d.color }}>{d.level}</span>
                          <span className="text-[10px] font-bold text-[#C00000]">{d.incidents} incidents</span>
                        </div>
                      </div>
                      <ul className="flex-1">
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><span className="text-gray-600">{d.level}</span></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#C00000]">{d.incidents}</b></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#FFB900]">{d.atRisk}</b></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#006D4E]">{d.availability}</b></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><span>{d.totalAssets}</span></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><span className="text-gray-600">{d.offline}</span></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#C00000]">{d.critical}</b></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#FFB900]">{d.warning}</b></li>
                        <li className="h-[54px] flex items-center px-3 border-b border-gray-200 text-xs text-gray-700"><b className="text-[#006D4E]">{d.healthy}</b></li>
                      </ul>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="h-12 border-t border-gray-200 flex items-center justify-center gap-3">
            <button disabled className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer" title="Prev">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer" title="Next">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
