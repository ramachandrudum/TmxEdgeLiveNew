type RailItem = {
  id: string
  title: string
  img?: string
  svg?: React.ReactNode
}

const railNav: RailItem[] = [
  {
    id: 'home',
    title: 'Home',
    img: '/Home.svg',
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    img: '/Dashboard.svg',
  },
  {
    id: 'incidents',
    title: 'Incidents',
    img: '/incidents.svg',
  },
  {
    id: 'tasks',
    title: 'Tasks',
    img: '/Tasks.svg',
  },
  {
    id: 'report',
    title: 'Report',
    img: '/Report.svg',
  },
]

const railBottom: RailItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    svg: (
      <svg viewBox="0 0 20 20" width={20} height={20} fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="10" cy="7" r="3" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      </svg>
    ),
  },
]

type Props = {
  active: string
  onSelect: (id: string) => void
  navIds?: string[]
}

function RailButton({ item, active, onClick }: { item: RailItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative rail-item w-11 h-11 flex items-center justify-center rounded-lg transition-all cursor-pointer mx-auto ${
        active
          ? 'active bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
    >
      {item.svg ? (
        item.svg
      ) : (
        <img
          src={item.img}
          alt={item.title}
          className={`w-5 h-5 object-contain transition-opacity ${
            active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
          }`}
        />
      )}
      <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="absolute -left-1.5 top-1/2 -translate-y-1/2">
          <path d="M7 1L1 6L7 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {item.title}
      </span>
    </button>
  )
}

export default function IconSidebar({ active, onSelect, navIds }: Props) {
  const items = navIds ? railNav.filter((item) => navIds.includes(item.id)) : railNav
  return (
    <aside className="bg-[#121212] flex flex-col z-[110] border-r border-white/5 shrink-0 overflow-hidden w-[70px]">

      <div className="flex-1 pt-4 pb-3 flex flex-col justify-between min-h-0">
        <div className="rail space-y-3">
          {items.map((item) => (
            <RailButton
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </div>
        <div className="rail-spacer flex-1 py-2" />
        <div className="rail space-y-3">
          {railBottom.map((item) => (
            <RailButton
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </div>
      </div>
    </aside>
  )
}