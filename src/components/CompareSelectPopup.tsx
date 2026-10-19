import { Search } from 'lucide-react'
import { useState } from 'react'
import { assetGroups, compareItems, compareTypes, systemGroups } from '../data/compare'

type Props = {
  actionLabel?: string
  initialType?: string
  onConfirm: (type: string, items: string[]) => void
  onClose: () => void
}

export default function CompareSelectPopup({ actionLabel = 'Compare', initialType, onConfirm, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(initialType ? 2 : 1)
  const [compareType, setCompareType] = useState(initialType ?? '')
  const [compareSelected, setCompareSelected] = useState<string[]>([])
  const [compareSearch, setCompareSearch] = useState('')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-[var(--theme-card)] rounded-xl shadow-2xl w-[420px] max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {step === 1 ? (
          <>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-900">Compare</h3>
            </div>
            <div className="p-3 space-y-1">
              {compareTypes.map((ct) => (
                <button
                  key={ct.id}
                  onClick={() => { setCompareType(ct.id); setStep(2); setCompareSelected([]); setCompareSearch('') }}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={ct.icon} />
                    </svg>
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-gray-900">{ct.label}</div>
                    <div className="text-[12px] text-gray-500">{ct.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
              <button onClick={onClose} className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-[15px] font-bold text-gray-900">Select {compareType === 'site' ? 'Sites' : compareType === 'unit' ? 'Units' : compareType === 'system' ? 'Systems' : 'Assets'} to Compare</h3>
              <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50">
                <Search className="w-3.5 h-3.5 text-gray-400" />
                <input
                  value={compareSearch}
                  onChange={(e) => setCompareSearch(e.target.value)}
                  placeholder="Search..."
                  className="flex-1 bg-transparent outline-none text-[12px] text-gray-700 placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="p-3 overflow-y-auto flex-1 min-h-0">
              {compareType === 'site' || compareType === 'unit' ? (
                <>
                  <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={compareSelected.length === (compareItems[compareType]?.length ?? 0)}
                      onChange={(e) => setCompareSelected(e.target.checked ? (compareItems[compareType] ?? []) : [])}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-[13px] font-semibold text-gray-900">Select All</span>
                  </label>
                  <div className="border-t border-gray-100 my-1" />
                  {(compareItems[compareType] ?? []).filter((item) => item.toLowerCase().includes(compareSearch.toLowerCase())).map((item) => (
                    <label key={item} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compareSelected.includes(item)}
                        onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[13px] text-gray-700">{item}</span>
                    </label>
                  ))}
                </>
              ) : compareType === 'system' ? (
                systemGroups.map((group) => {
                  const filteredChildren = group.children?.filter((c) => c.toLowerCase().includes(compareSearch.toLowerCase()))
                  if (compareSearch && (!filteredChildren || filteredChildren.length === 0)) return null
                  const allChildren = group.children ?? []
                  const allSelected = allChildren.length > 0 && allChildren.every((c) => compareSelected.includes(c))
                  return (
                    <div key={group.name} className="mb-2">
                      <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer bg-gray-50/50">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCompareSelected([...compareSelected, ...allChildren.filter((c) => !compareSelected.includes(c))])
                            } else {
                              setCompareSelected(compareSelected.filter((s) => !allChildren.includes(s)))
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wider">{group.name}</span>
                      </label>
                      {filteredChildren?.map((item) => (
                        <label key={item} className="flex items-center gap-3 pl-8 pr-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={compareSelected.includes(item)}
                            onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-[13px] text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  )
                })
              ) : (
                assetGroups.map((site) => (
                  <div key={site.name} className="mb-3">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">{site.name}</div>
                    {site.children.map((unit) => (
                      <div key={unit.name} className="ml-3 mb-2">
                        <div className="px-3 py-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">{unit.name}</div>
                        {unit.children.map((system) => {
                          const filteredAssets = system.children.filter((a) => a.toLowerCase().includes(compareSearch.toLowerCase()))
                          if (compareSearch && filteredAssets.length === 0) return null
                          return (
                            <div key={system.name} className="ml-3 mb-1">
                              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{system.name}</div>
                              {filteredAssets.map((item) => (
                                <label key={item} className="flex items-center gap-3 pl-6 pr-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={compareSelected.includes(item)}
                                    onChange={(e) => setCompareSelected(e.target.checked ? [...compareSelected, item] : compareSelected.filter((s) => s !== item))}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-[13px] text-gray-700">{item}</span>
                                </label>
                              ))}
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-between">
              <button onClick={() => { setStep(1); setCompareSelected([]); setCompareSearch('') }} className="px-4 py-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                Back
              </button>
              <button
                disabled={compareSelected.length === 0}
                onClick={() => onConfirm(compareType, compareSelected)}
                className="px-4 py-2 text-[13px] font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {actionLabel} ({compareSelected.length})
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
