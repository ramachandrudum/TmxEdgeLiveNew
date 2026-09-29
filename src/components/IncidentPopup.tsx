import { ChevronLeft, X } from 'lucide-react'

export type IncidentItem = {
  id: string
  time: string
  title: string
  source: string
  kpiLabel: string
  kpiValue: string
  kpiDelta: string
  status: 'cr' | 'wr' | 'dv'
  cause?: string
  severity: 'Critical' | 'Warning'
  openStatus: 'Open' | 'Acknowledged' | 'Resolved'
  startDate: string
  unitName: string
  equipment: string
  kpiName: string
  dataTag: string
  value: string
  unit: string
  timestamp: string
  badges: { label: string; color: string }[]
}

export function IncidentPopup({ incident, onBack, onClose }: { incident: IncidentItem; onBack?: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[800px] max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-5 pt-4 pb-3 border-b border-gray-200">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {onBack && (
                <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer shrink-0" title="Back to incidents">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <span className="text-[15px] font-bold text-gray-900 truncate">{incident.unitName} - {incident.title}</span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="py-0.5 px-2 rounded text-[11px] font-semibold bg-red-100 text-red-700">{incident.severity}</span>
              <span className="py-0.5 px-2 rounded text-[11px] font-semibold bg-blue-100 text-blue-700">{incident.openStatus}</span>
              <span className="text-[12px] text-gray-400">Start Date: <span className="font-semibold text-gray-700">{incident.startDate}</span></span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6 9 17l-5-5" /></svg>
                Approve
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a2 2 0 0 0 1 1h12a2 2 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a2 2 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 2 0 0 1 1 1z" /></svg>
                Pin
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" x2="4" y1="22" y2="15" /></svg>
                Flag Noise
              </button>
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-gray-200 text-[11px] text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                Assign
              </button>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0 space-y-4">
          <div className="border border-gray-200 rounded-lg overflow-hidden text-[13px]">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2 font-bold bg-[var(--theme-surface-header)] w-[130px] text-gray-700">Unit Name</td>
                  <td className="px-3 py-2 bg-[var(--theme-surface-header)] text-gray-900">{incident.unitName}</td>
                  <td className="px-3 py-2 font-bold bg-[var(--theme-surface-header)] w-[180px] text-gray-700">Equipment</td>
                  <td className="px-3 py-2 bg-[var(--theme-surface-header)] text-gray-900">{incident.equipment}</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-gray-700">KPI</td>
                  <td colSpan={3} className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="text-[13px] font-semibold text-gray-900 truncate">{incident.kpiName}</div>
                        <div className="text-[12px] text-gray-500 truncate">{incident.dataTag}</div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <div className="text-[13px] font-bold text-gray-900">{incident.value} <span className="text-[11px] font-normal text-gray-400">{incident.unit}</span></div>
                          <div className="text-[11px] text-gray-400">{incident.timestamp}</div>
                        </div>
                        <div className="flex gap-0.5">
                          {incident.badges.map((b, i) => (
                            <span key={i} className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold ${b.color}`}>{b.label}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
              <span className="text-[13px] font-bold text-gray-800">Deviations</span>
            </div>
            <div className="p-3">
              <div className="h-[200px] bg-white rounded border border-gray-100 overflow-hidden">
                <svg viewBox="0 0 600 200" preserveAspectRatio="none" className="w-full h-full block">
                  <line x1="0" y1="40" x2="600" y2="40" stroke="#dc3545" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="var(--theme-border)" strokeWidth="1" />
                  <line x1="0" y1="160" x2="600" y2="160" stroke="var(--theme-border)" strokeWidth="1" />
                  <polyline
                    fill="none"
                    stroke="#BD4F5B"
                    strokeWidth="2"
                    points="0,150 30,145 60,148 90,140 120,142 150,130 180,135 210,120 240,125 270,110 300,115 330,105 360,108 390,95 420,100 450,90 480,85 510,80 540,75 570,70 600,65"
                  />
                  <polyline
                    fill="none"
                    stroke="#000"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                    points="0,120 30,118 60,122 90,115 120,118 150,110 180,112 210,105 240,108 270,100 300,102 330,95 360,98 390,90 420,92 450,85 480,82 510,78 540,75 570,70 600,68"
                    opacity="0.6"
                  />
                  <rect x="0" y="130" width="600" height="30" fill="rgb(251,177,74)" fillOpacity="0.3" />
                  <text x="5" y="15" fontSize="10" fill="var(--theme-muted)">mm</text>
                  <text x="570" y="15" fontSize="10" fill="var(--theme-muted)">Kg/cm²</text>
                  <text x="100" y="195" fontSize="9" fill="var(--theme-muted)">08:30</text>
                  <text x="250" y="195" fontSize="9" fill="var(--theme-muted)">09:30</text>
                  <text x="400" y="195" fontSize="9" fill="var(--theme-muted)">10:00</text>
                  <text x="530" y="195" fontSize="9" fill="var(--theme-muted)">10:30</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-600 text-blue-600 text-[13px] font-semibold hover:bg-blue-50 transition-colors cursor-pointer">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
            More Details
          </button>
        </div>
      </div>
    </div>
  )
}
