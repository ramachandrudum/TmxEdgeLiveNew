import { Search, Star } from 'lucide-react'
import { useState } from 'react'
import CustomerLogo from './Logos'
import { customers } from '../data/dashboard'

type Props = {
  active: string
  onSelect: (id: string) => void
}

export default function CustomerSidebar({ active, onSelect }: Props) {
  const [collapsed, setCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [favs, setFavs] = useState<string[]>(customers.filter((c) => c.favorite).map((c) => c.id))

  const match = (c: (typeof customers)[number]) =>
    c.name.toLowerCase().includes(query.toLowerCase())

  const favorites = customers.filter((c) => favs.includes(c.id)).filter(match)
  const recentlyAdded = customers.filter((c) => c.recent && !favs.includes(c.id)).filter(match)

  const toggleFav = (id: string) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))

  const renderSectionTitle = (title: string) =>
    !collapsed && (
      <div className="px-4 pt-3 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
          {title}
        </span>
      </div>
    )

  const renderRow = (c: (typeof customers)[number]) => (
    <div
      key={c.id}
      role="button"
      tabIndex={0}
      title={collapsed ? c.name : undefined}
      onClick={() => {
        onSelect(c.id)
        setQuery('')
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(c.id)
          setQuery('')
        }
      }}
      className={`w-full flex items-center gap-3 py-2.5 cursor-pointer transition-colors ${
        collapsed ? 'px-2 justify-center' : 'px-4 justify-start'
      } ${
        active === c.id
          ? 'bg-[#2563EB]/10 border-r-2 border-[#2563EB]'
          : 'hover:bg-gray-50'
      }`}
    >
      <CustomerLogo customer={c} />
      {!collapsed && (
        <div className="min-w-0 text-left flex-1">
          <div className="text-sm font-semibold text-gray-900 truncate">{c.name}</div>
          <div className="text-xs text-gray-500">
            {c.sites} sites, {c.units} units
          </div>
        </div>
      )}
      {!collapsed && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleFav(c.id)
          }}
          className="shrink-0 text-gray-300 hover:text-amber-500 transition-colors"
          title={favs.includes(c.id) ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className="w-[10px] h-[10px]"
            fill={favs.includes(c.id) ? '#F59E0B' : 'none'}
            color={favs.includes(c.id) ? '#F59E0B' : 'currentColor'}
          />
        </button>
      )}
    </div>
  )

  return (
    <aside
      className={`flex flex-col shrink-0 border-r border-gray-200 bg-[#F9FAFC] transition-all duration-300 overflow-hidden ${
        collapsed ? 'w-[50px]' : 'w-[200px]'
      }`}
    >
      <div className="flex items-center justify-between px-3 h-12 border-b border-gray-100 shrink-0">
        {!collapsed && (
          <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-500">
            Customers
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="rp-collapse-btn"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3.5" width="14" height="13" rx="2" />
            <line x1="7.5" y1="3.5" x2="7.5" y2="16.5" />
            <path d="M13 7.5l-2.5 2.5 2.5 2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="px-3 py-2 border-b border-gray-100 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search customers..."
              className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-200 bg-gray-50 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto no-scrollbar py-2 min-h-0">
        <button
          onClick={() => {
            onSelect('all')
            setQuery('')
          }}
          className={`w-full flex items-center gap-3 py-2.5 cursor-pointer transition-colors ${
            collapsed ? 'px-2 justify-center' : 'px-4 justify-start'
          } ${
            active === 'all'
              ? 'bg-[#2563EB]/10 border-r-2 border-[#2563EB]'
              : 'hover:bg-gray-50'
          }`}
        >
          <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0" style={{ background: '#2563EB' }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none"><path d="M4 21V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14M12 21v-9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="text-white" /></svg>
          </div>
          {!collapsed && (
            <div className="min-w-0 text-left flex-1">
              <div className="text-sm font-semibold text-gray-900 truncate">All Customers</div>
              <div className="text-xs text-gray-500">
                {customers.length} customers
              </div>
            </div>
          )}
        </button>

        {!collapsed && favorites.length > 0 && (
          <>
            {renderSectionTitle('Favorites')}
            {favorites.map(renderRow)}
          </>
        )}

        {!collapsed && recentlyAdded.length > 0 && (
          <>
            {renderSectionTitle('Other')}
            {recentlyAdded.map(renderRow)}
          </>
        )}

        {!collapsed && !query && favorites.length === 0 && recentlyAdded.length === 0 && (
          <div className="px-4 py-6 text-xs text-gray-400 text-center">
            No customers yet.
          </div>
        )}
      </div>
    </aside>
  )
}