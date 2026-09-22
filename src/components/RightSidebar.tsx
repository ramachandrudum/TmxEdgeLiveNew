import { X } from 'lucide-react'

const priorityData = [
  { row: 'New', high: 0, medium: 0, low: 0 },
  { row: 'In Progress', high: 41, medium: 33, low: 16 },
]

const severityColor: Record<string, string> = {
  high: 'rgb(220, 18, 10)',
  medium: 'rgb(255, 147, 56)',
  low: 'rgb(255, 213, 66)',
}

interface Alert {
  type: 'Incident' | 'Task'
  title: string
  time: string
  severity: 'DEVIATION' | 'MEDIUM' | 'HIGH'
  severityColor: string
  unit?: string
  asset?: string
  tagLabel?: string
  tagValue?: string
}

const alerts: Alert[] = [
  { type: 'Incident', title: 'BWRO Com Cartridge Filter 2 Anomaly', time: '22 Sep, 11:04 AM', severity: 'DEVIATION', severityColor: 'rgb(255, 193, 7)', unit: 'Indian Rayon WTP', asset: 'BWRO Common 2', tagLabel: 'BWRO Cartridge Filter B Feed Flow', tagValue: '50.62' },
  { type: 'Incident', title: 'Mb 2-1 Anomaly', time: '22 Sep, 09:57 AM', severity: 'DEVIATION', severityColor: 'rgb(255, 193, 7)', unit: 'Indian Rayon WTP', asset: 'Mix Bed 2', tagLabel: 'Mixed Bed B DM Flow TOTAL FLOW', tagValue: '152291.87' },
  { type: 'Task', title: 'High ORP in SWRO Feed (273.47)', time: '09:19 AM', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Indian Rayon WTP' },
  { type: 'Task', title: 'Chemicals Data not entered on 21 September 2026', time: '12:00 AM', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Indian Rayon WTP' },
  { type: 'Task', title: 'Opening stock is negative on 21 September 2026', time: '12:00 AM', severity: 'HIGH', severityColor: 'rgb(255, 46, 25)', unit: 'Indian Rayon WTP' },
  { type: 'Task', title: 'SWRO Skid C High Feed Pressure (75.18)', time: '21 Sep, 2026', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Indian Rayon WTP' },
  { type: 'Task', title: 'BWRO Common Low Feed Flow (6.88)', time: '21 Sep, 2026', severity: 'MEDIUM', severityColor: 'rgb(255, 113, 25)', unit: 'Indian Rayon WTP' },
]

export default function RightSidebar({ onClose }: { onClose: () => void }) {
  return (
    <div className="w-[340px] shrink-0 border-l border-gray-200 bg-white flex flex-col min-h-0">
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 shrink-0">
        <div className="flex flex-col">
          <span className="text-[13px] font-bold text-gray-900">Priority Actions</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-gray-500 cursor-pointer">Incident: <strong className="text-gray-700">40</strong></span>
            <span className="text-[10px] text-gray-500 cursor-pointer">Task: <strong className="text-gray-700">3888</strong></span>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-200 shrink-0">
        <table className="w-full text-[11px]" style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
          <thead>
            <tr>
              <th className="font-normal text-gray-400 text-center py-1"></th>
              <th className="font-normal text-gray-400 text-center py-1">High</th>
              <th className="font-normal text-gray-400 text-center py-1">Medium</th>
              <th className="font-normal text-gray-400 text-center py-1">Low</th>
            </tr>
          </thead>
          <tbody>
            {priorityData.map((r) => (
              <tr key={r.row}>
                <td className="text-right text-gray-400 text-[10px] py-1 pr-1">{r.row}</td>
                {(['high', 'medium', 'low'] as const).map((col) => (
                  <td
                    key={col}
                    className="text-center py-1.5 cursor-pointer font-normal"
                    style={{
                      background: severityColor[col],
                      color: col === 'high' ? '#fff' : '#111',
                      width: 65,
                      borderRadius: 2,
                    }}
                  >
                    {r[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="px-3 py-2 shrink-0">
          <span className="text-[12px] font-bold text-gray-900">Alerts and Recommendations</span>
        </div>
        <div className="px-3 pb-3 flex flex-col gap-2">
          {alerts.map((a, i) => (
            <div key={i} className="border border-gray-200 rounded-md p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span>{a.type}</span>
                  <span>{a.time}</span>
                </div>
                <span
                  className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white"
                  style={{ background: a.severityColor }}
                >
                  {a.severity}
                </span>
              </div>
              <div className="text-[12px] font-semibold text-gray-900 leading-tight">{a.title}</div>
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-gray-100">
                {a.unit && (
                  <div className="text-[9px]">
                    <span className="text-gray-400 font-normal">Unit </span>
                    <span className="font-bold text-gray-700">{a.unit}</span>
                  </div>
                )}
                {a.asset && (
                  <div className="text-[9px]">
                    <span className="text-gray-400 font-normal">Asset </span>
                    <span className="font-bold text-gray-700">{a.asset}</span>
                  </div>
                )}
              </div>
              {a.tagLabel && (
                <div className="text-[10px] text-gray-600 mt-0.5">
                  <span className="font-normal">{a.tagLabel}</span>
                  {a.tagValue && <span className="ml-1 text-amber-500 font-medium">{a.tagValue}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
