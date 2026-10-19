import { X } from 'lucide-react'
import type { CSSProperties } from 'react'

export type TaskPopupData = {
  title: string
  sub: string
  avatar?: string
  path: string[]
}

const taskMask: CSSProperties = {
  background: 'var(--status-healthy-text)',
  WebkitMaskImage: 'url(/Tasks.svg)',
  maskImage: 'url(/Tasks.svg)',
  WebkitMaskRepeat: 'no-repeat',
  maskRepeat: 'no-repeat',
  WebkitMaskSize: 'contain',
  maskSize: 'contain',
  WebkitMaskPosition: 'center',
  maskPosition: 'center',
}

export function TaskPopup({ task, onClose }: { task: TaskPopupData; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[560px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 theme-status-healthy-soft theme-status-healthy-text">
              <span className="w-[13px] h-[13px] shrink-0" style={taskMask} />
            </span>
            <h3 className="text-[15px] font-bold text-gray-900">Task</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto flex-1 min-h-0 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="py-0.5 px-2 rounded text-[11px] font-semibold" style={{ backgroundColor: 'var(--status-warning-surface)', color: 'var(--status-warning-text)' }}>Open</span>
            <span className="py-0.5 px-2 rounded text-[11px] font-semibold" style={{ backgroundColor: 'var(--status-critical-surface)', color: 'var(--status-critical-text)' }}>Overdue</span>
            <span className="text-[12px] text-gray-400">
              Due: <span className="font-semibold text-gray-700">{task.sub.includes(':') ? task.sub.split(':').slice(1).join(':').trim() : task.sub}</span>
            </span>
          </div>
          <div className="text-[15px] font-bold text-gray-900">{task.title}</div>
          <div className="text-[12px] text-gray-500">{task.sub}</div>
          <div className="border border-gray-200 rounded-lg overflow-hidden text-[13px]">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-3 py-2 font-bold bg-[var(--theme-surface-header)] w-[130px] text-gray-700">Assignee</td>
                  <td className="px-3 py-2 bg-[var(--theme-surface-header)]">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#5B5FC7] text-white text-[10px] font-bold flex items-center justify-center shrink-0">{task.avatar ?? 'RM'}</span>
                      <span className="text-gray-900">{task.avatar ?? 'RM'}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-bold text-gray-700 align-top">Location</td>
                  <td className="px-3 py-2 text-gray-900">
                    {task.path.map((p, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-gray-400 mx-0.5">&gt;</span>}
                        {p}
                      </span>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-200 text-[13px] font-bold text-gray-800">Description</div>
            <div className="p-3 text-[12px] text-gray-600">
              Review the readings for the asset above, capture the observation and record the corrective action taken in the maintenance log.
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 text-[13px] font-semibold hover:bg-blue-600 hover:text-white hover:shadow-md transition-colors cursor-pointer">
            Acknowledge
          </button>
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 text-[13px] font-semibold hover:bg-blue-600 hover:text-white hover:shadow-md transition-colors cursor-pointer">
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  )
}
