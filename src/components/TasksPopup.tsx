import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Flag,
  Heart,
  Link2,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Share2,
  Users,
  X,
} from 'lucide-react'
import type { CSSProperties } from 'react'
import { taskRows, type MonitorAsset, type MonitorTask } from '../data/assetMonitor'

export const taskMask: CSSProperties = {
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

const AVATAR_COLORS = ['#5B5FC7', '#0E7490', '#B45309', '#047857', '#BE185D', '#1D4ED8']

const avatarColor = (seed: string) => {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

export function TaskListPopup({ asset, onSelect, onClose }: { asset: MonitorAsset; onSelect: (t: MonitorTask) => void; onClose: () => void }) {
  const tasks = taskRows.filter((t) => t.assetId === asset.id)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[700px] max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-[15px] font-bold text-gray-900">
            Tasks · {asset.name} ({tasks.length})
          </h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {tasks.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelect(t)}
              className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 cursor-pointer group"
            >
              <span className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 theme-status-healthy-soft theme-status-healthy-text">
                <span className="w-[13px] h-[13px] shrink-0 transition-all opacity-70 group-hover:opacity-100" style={taskMask} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] text-gray-400 mb-1">{t.time}</div>
                <div className="text-[13px] font-semibold text-gray-900">{t.title}</div>
                <div className="text-[12px] text-gray-500 mt-0.5">{t.unit}</div>
              </div>
              <span className="w-6 h-6 rounded-full text-white text-[10px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: avatarColor(t.avatar) }}>{t.avatar}</span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0" />
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="px-5 py-10 text-center text-[12px] text-gray-400">No open tasks for {asset.name}.</div>
          )}
        </div>
      </div>
    </div>
  )
}

const DETAIL_FIELD_STYLE =
  'px-4 py-3 font-bold text-[12px] text-gray-700 bg-[var(--theme-surface-header)] w-[150px] align-top'

const teamName = (task: MonitorTask) => {
  const area = task.unit.split('/').pop()?.trim()
  return area ? `${area} Maintenance Team` : 'Maintenance Team'
}

export function TaskDetailPopup({ task, asset, onBack, onClose }: { task: MonitorTask; asset: MonitorAsset; onBack?: () => void; onClose: () => void }) {
  const comments = [
    { id: 'c1', avatar: 'PS', name: 'Priya Singh', time: '25/Sep 12:30 pm', text: 'I\'ve scheduled a maintenance visit for Thursday at 10am. Work order 4456 has been created.', likes: 4 },
    { id: 'c2', avatar: 'KL', name: 'Karan Luthra', time: '25/Sep 06:30 am', text: 'Keep the log updated with current readings. Note that {asset.name} is running low on charge (R134a).', likes: 2 },
    { id: 'c3', avatar: 'RS', name: 'Rudra Singh', time: '25/Sep 6:15 am', text: 'Security key required for the rooftop access. Please check with facilities for the badge code.', likes: 1 },
  ]
  const collaborators = [
    { avatar: 'RM', name: 'Rahul M.' },
    { avatar: 'PS', name: 'Priya Singh' },
    { avatar: 'RS', name: 'Rudra Singh' },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-[min(980px,95vw)] max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-200 gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {onBack && (
              <button onClick={onBack} className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer shrink-0" title="Back to tasks">
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-semibold border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer shrink-0">
              <Check className="w-3.5 h-3.5" />
              Mark complete
            </button>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Attach"><Paperclip className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Copy link"><Link2 className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Share"><Share2 className="w-4 h-4" /></button>
            <button className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="More"><MoreHorizontal className="w-4 h-4" /></button>
            <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer" title="Close details">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-5 py-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="py-0.5 px-2 rounded text-[11px] font-semibold" style={{ backgroundColor: 'var(--status-warning-surface)', color: 'var(--status-warning-text)' }}>Open</span>
              <span className="text-[12px] text-gray-400">
                <span className="font-semibold text-gray-700">{task.time}</span>
              </span>
            </div>
            <h3 className="mt-2.5 text-[15px] font-bold text-gray-900">{task.title}</h3>
            <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden text-[13px]">
              <table className="w-full border-collapse">
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className={DETAIL_FIELD_STYLE}>Created by</td>
                    <td className="px-4 py-3 text-gray-900">{task.avatar === 'AJ' ? 'Anand Joy' : 'Rahul M.'}</td>
                    <td className={DETAIL_FIELD_STYLE}>Team</td>
                    <td className="px-4 py-3 text-gray-900">{teamName(task)}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className={DETAIL_FIELD_STYLE}>Site</td>
                    <td className="px-4 py-3 text-gray-900">Nestle UAE</td>
                    <td className={DETAIL_FIELD_STYLE}>Unit</td>
                    <td className="px-4 py-3 text-gray-900">{task.unit.includes('/') ? task.unit.split('/').slice(1).join('/').trim() : task.unit}</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className={DETAIL_FIELD_STYLE}>Source</td>
                    <td className="px-4 py-3 text-gray-900">ClickUp</td>
                    <td className={DETAIL_FIELD_STYLE}>Status</td>
                    <td className="px-4 py-3 text-gray-900">Open</td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className={DETAIL_FIELD_STYLE}>Priority</td>
                    <td className="px-4 py-3 text-gray-900">High</td>
                    <td className={DETAIL_FIELD_STYLE}>Views</td>
                    <td className="px-4 py-3 text-gray-900">35</td>
                  </tr>
                  <tr>
                    <td className={DETAIL_FIELD_STYLE}>Labels</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="py-0.5 px-1.5 rounded text-[10px] font-semibold bg-blue-100 text-blue-700">Verification</span>
                        <span className="py-0.5 px-1.5 rounded text-[10px] font-semibold bg-purple-100 text-purple-700">Value Engineering</span>
                      </div>
                    </td>
                    <td className={DETAIL_FIELD_STYLE}>Equipments</td>
                    <td className="px-4 py-3 text-[12px] text-gray-900">{asset.name}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: avatarColor(task.avatar) }}>{task.avatar}</span>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">Anand Joy</div>
                  <div className="text-[11px] text-gray-400">Assignee</div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 bg-orange-100 text-orange-600"><Calendar className="w-4 h-4" /></span>
                <div>
                  <div className="text-[13px] font-bold text-gray-900">28 Sep, 2026</div>
                  <div className="text-[11px] text-gray-400">Due date</div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[13px] font-bold text-gray-800 mb-2">Description</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 bg-[var(--theme-surface-header)]">
                  {['B', 'I', 'U', 'S', '•', '1.', '"'].map((f, i) => (
                    <button key={i} className="w-6 h-6 rounded text-[11px] font-bold text-gray-500 hover:bg-gray-200 cursor-pointer">{f}</button>
                  ))}
                  <div className="flex-1" />
                  <button className="w-6 h-6 rounded text-gray-400 hover:bg-gray-200 flex items-center justify-center cursor-pointer"><Link2 className="w-3 h-3" /></button>
                  <button className="w-6 h-6 rounded text-gray-400 hover:bg-gray-200 flex items-center justify-center cursor-pointer"><MoreHorizontal className="w-3 h-3" /></button>
                </div>
                <div className="p-3 text-[12px] text-gray-600 leading-relaxed">
                  Icing detected on the cooling coil. Need to inspect the drain pan and clean the coil fins as part of preventive maintenance. Schedule a technician visit this week and monitor coil temperature trends. Record the {task.title.toLowerCase()} findings in the maintenance log once the visit is done.
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[13px] font-bold text-gray-800">Subtasks</div>
                <button className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
                  <Plus className="w-3.5 h-3.5" /> Add subtask
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 overflow-hidden">
                {[
                  { done: true, label: 'Raise work order', tag: 'WO-4456', color: 'bg-green-100 text-green-700' },
                  { done: false, label: 'Confirm rooftop access badge', tag: 'Pending', color: 'bg-yellow-100 text-yellow-700' },
                  { done: false, label: 'Log readings post maintenance', tag: 'Scheduled', color: 'bg-blue-100 text-blue-700' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                    <button className={`w-4 h-4 rounded flex items-center justify-center shrink-0 cursor-pointer ${s.done ? 'bg-[var(--status-healthy-text)] text-white' : 'border border-gray-300'}`}>
                      {s.done && <Check className="w-3 h-3" />}
                    </button>
                    <span className={`flex-1 min-w-0 text-[12px] ${s.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{s.label}</span>
                    <span className={`text-[10px] font-semibold py-0.5 px-1.5 rounded ${s.color}`}>{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[13px] font-bold text-gray-800 mb-2">Activity</div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-start gap-2.5 p-3">
                  <span className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: avatarColor('RM') }}>RM</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-gray-500 mb-1">Add comment...</div>
                    <div className="p-2 rounded border border-gray-200 min-h-[46px] flex items-center gap-2">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Flag className="w-3 h-3" /> Blueprint</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Link2 className="w-3 h-3" /> URL</span>
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Tweet</span>
                    </div>
                  </div>
                </div>
                <div className="px-3 pb-2">
                  <div className="text-[11px] font-bold text-gray-500">Comments ({comments.length})</div>
                </div>
                <div className="pb-3">
                  {comments.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 px-3 py-2.5 border-t border-gray-100">
                      <span className="w-6 h-6 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0" style={{ backgroundColor: avatarColor(c.name) }}>{c.avatar}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] font-semibold text-gray-800">{c.name}</span>
                          <span className="text-[10px] text-gray-400">{c.time}</span>
                        </div>
                        <div className="text-[12px] text-gray-600 mt-0.5 leading-relaxed">{c.text.replace('{asset.name}', asset.name)}</div>
                        <button className="mt-1.5 flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Heart className="w-3 h-3" /> Like {c.likes}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-5 py-3 border-t border-gray-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">Collaborators ({collaborators.length})</span>
            {collaborators.map((c) => (
              <span key={c.name} className="w-5 h-5 rounded-full text-white text-[8px] font-bold flex items-center justify-center" style={{ backgroundColor: avatarColor(c.name) }}>{c.avatar}</span>
            ))}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-400">
            <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
              <Users className="w-3.5 h-3.5" /> Leave task
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}