type RailItem = {
  id: string
  title: string
  img?: string
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

type Props = {
  active: string
  onSelect: (id: string) => void
  navIds?: string[]
}

function RailButton({ item, active, onClick }: { item: RailItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative rail-item w-full flex flex-col items-center justify-center gap-[3px] transition-all cursor-pointer mb-[15px] overflow-visible pt-[10px] pb-[10px] ${
        active
          ? 'bg-[#005EDB] text-white rounded-[10px]'
          : 'text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      <img
          src={item.img}
          alt={item.title}
          className={`w-4 h-4 object-contain transition-all ${
            active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'
          }`}
        />
      <span className={`text-[8px] font-medium leading-none truncate w-full px-0.5 text-center uppercase tracking-wide pt-[5px] ${
        active ? 'text-white' : 'text-white/70'
      }`}>
        {item.title}
      </span>
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
    <aside className="bg-[#121212] flex flex-col z-[110] border-r border-white/5 shrink-0 overflow-hidden w-[76px]">

      <div className="flex-1 pt-4 pb-3 flex flex-col justify-between min-h-0">
        <div className="rail w-[65px] ml-[5px]">
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
      </div>
    </aside>
  )
}