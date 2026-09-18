import { Cpu, ChevronRight, Maximize2, X, MessageSquare, Send } from 'lucide-react'
import type { Customer } from '../data/dashboard'

type Props = {
  open: boolean
  onClose: () => void
  customer?: Customer | null
  activeBU: string
  site?: string
}

export default function AICopilot({ open, onClose, customer, activeBU, site }: Props) {
  const orgName = customer?.name ?? 'Polar Thermal Systems'
  const contextLabel = [orgName, site, activeBU].filter(Boolean).join(' · ')

  return (
    <div
      className={`absolute right-0 top-0 z-50 w-[350px] border-l border-gray-200 bg-white flex flex-col h-full overflow-hidden transition-all duration-300 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex flex-col">
          <h2 className="text-sm font-bold text-gray-900">AI Copilot</h2>
          <span className="text-[10px] text-gray-400">Context: {contextLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <button title="Expand to half screen" className="p-1 hover:bg-gray-100 rounded transition-colors">
            <Maximize2 className="w-4 h-4 text-gray-500" />
          </button>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center max-w-sm mx-auto space-y-5 py-4">
          <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
            <Cpu className="w-9 h-9 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-gray-900">{orgName}</h4>
            <p className="text-sm text-gray-400 leading-relaxed px-2">
              What would you like to do with {orgName}?
            </p>
          </div>

          <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200">
            <button className="w-full flex items-center justify-between px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer">
              <span>Analyze health</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer">
              <span>Show alerts</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-xs text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-colors cursor-pointer">
              <span>Recommend maintenance</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          <div className="text-left">
            <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 text-center">
              Recent conversations
            </h5>
            <div className="flex flex-col divide-y divide-gray-200 border-y border-gray-200 rounded-xl">
              {[
                { title: 'Health analysis', time: '2m ago' },
                { title: 'Active alert review', time: '1h ago' },
                { title: 'Maintenance planning', time: 'Yesterday' },
                { title: 'Alert follow-up', time: '2 days ago' },
              ].map((item) => (
                <button
                  key={item.title}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[11px] font-semibold text-gray-800 truncate">
                      {item.title}
                    </span>
                    <span className="block text-[9px] text-gray-400">{item.time}</span>
                  </span>
                  <ChevronRight className="w-3 h-3 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex gap-2">
          <input
            placeholder="Ask about assets, alerts..."
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            type="text"
          />
          <button className="px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
