import { AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react'

const metrics = [
  {
    icon: Zap,
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    num: '46%',
    label: 'Avg Risk Score',
    caption: (name?: string) => `Across all assets, ${name ? name : 'fleet-wide'}`,
  },
  {
    icon: AlertTriangle,
    iconBg: '#FFEBEE',
    iconColor: '#dc3545',
    num: '16%',
    label: 'Critical Asset Ratio',
    caption: () => 'Share of assets in critical state',
  },
  {
    icon: CheckCircle,
    iconBg: '#E8F5E9',
    iconColor: '#2E7D32',
    num: '33%',
    label: 'Task Completion Rate',
    caption: (name?: string) => `Of all tasks raised, ${name ? name : 'fleet-wide'}`,
  },
  {
    icon: Clock,
    iconBg: '#E3F2FD',
    iconColor: '#1565C0',
    num: '50%',
    label: 'On-Time Task Rate',
    caption: (name?: string) => `Not overdue, ${name ? name : 'fleet-wide'}`,
  },
]

export default function PerformanceMetrics({ customerName }: { customerName?: string }) {
  return (
    <div style={{ marginTop: 28 }}>
      <div className="text-sm font-bold text-gray-800 mb-3">Performance Metrics</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon
          return (
            <div
              key={m.label}
              className="bg-white border border-gray-200 rounded-md px-2 py-[5px] flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: m.iconBg, color: m.iconColor }}
              >
                <Icon className="w-[15px] h-[15px]" strokeWidth={1.7} />
              </div>
              <div className="min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold text-gray-900">{m.num}</span>
                  <span className="text-xs text-gray-900 font-semibold">{m.label}</span>
                </div>
                <div className="text-[11px] text-gray-500 truncate">{m.caption(customerName)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
