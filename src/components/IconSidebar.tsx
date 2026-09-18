type RailItem = {
  id: string
  title: string
  svg: React.ReactNode
}

const svgProps = {
  viewBox: '0 0 20 20',
  width: 20,
  height: 20,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
} as const

const railNav: RailItem[] = [
  {
    id: 'home',
    title: 'Home',
    svg: (
      <svg {...svgProps} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10l7-7 7 7M5 8v8a1 1 0 001 1h3v-4h2v4h3a1 1 0 001-1V8" />
      </svg>
    ),
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    svg: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="6" height="6" rx="1" />
        <rect x="11" y="3" width="6" height="6" rx="1" />
        <rect x="3" y="11" width="6" height="6" rx="1" />
        <rect x="11" y="11" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    id: 'incidents',
    title: 'Incidents',
    svg: (
      <svg {...svgProps} strokeLinejoin="round">
        <path d="M10 2c-1.2 1.2-1.6 2.4-1.5 3.6A5.5 5.5 0 005 11c0 4-1.5 5.5-1.5 5.5h13S15 15 15 11a5.5 5.5 0 00-3.5-5.4c.1-1.2-.3-2.4-1.5-3.6z" />
        <path d="M8 16.5a2 2 0 004 0" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    svg: (
      <svg {...svgProps} strokeLinejoin="round" strokeLinecap="round">
        <path d="M13.5 3.5a3.5 3.5 0 00-4.6 4.2L3.5 13a1.5 1.5 0 002.1 2.1l5.3-5.4a3.5 3.5 0 004.2-4.6l-2.3 2.3-1.7-.5-.5-1.7 2.3-2.3z" />
      </svg>
    ),
  },
  {
    id: 'checklist',
    title: 'Checklist',
    svg: (
      <svg {...svgProps}>
        <rect x="4" y="4" width="12" height="12" rx="2" />
        <path d="M7 10.2l1.8 1.8L13.2 8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'tasks',
    title: 'Tasks',
    svg: (
      <svg {...svgProps}>
        <rect x="5" y="3" width="10" height="14" rx="1.5" />
        <path d="M8 3V2.5a1 1 0 011-1h2a1 1 0 011 1V3" strokeLinecap="round" />
        <path d="M7.5 8h5M7.5 11h5M7.5 14h3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'tags',
    title: 'Tags',
    svg: (
      <svg {...svgProps}>
        <rect x="3" y="4" width="14" height="10" rx="1.5" />
        <circle cx="7" cy="9" r="1" fill="currentColor" stroke="none" />
        <circle cx="10" cy="9" r="1" fill="currentColor" stroke="none" />
        <path d="M13 8v2M7 17h6" strokeLinecap="round" />
      </svg>
    ),
  },
]

const railBottom: RailItem[] = [
  {
    id: 'profile',
    title: 'Profile',
    svg: (
      <svg {...svgProps}>
        <circle cx="10" cy="7" r="3" />
        <path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
      </svg>
    ),
  },
]

type Props = {
  active: string
  onSelect: (id: string) => void
}

function RailButton({ item, active, onClick }: { item: RailItem; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group relative rail-item w-10 h-10 flex items-center justify-center rounded-lg transition-all cursor-pointer mx-auto ${
        active
          ? 'active bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : 'text-white/50 hover:text-white hover:bg-white/10'
      }`}
    >
      {item.svg}
      <span className="absolute left-full ml-2 px-2.5 py-1 rounded-md bg-black text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity flex items-center gap-1.5 z-50">
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="absolute -left-1.5 top-1/2 -translate-y-1/2">
          <path d="M7 1L1 6L7 11" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {item.title}
      </span>
    </button>
  )
}

export default function IconSidebar({ active, onSelect }: Props) {
  return (
    <aside className="bg-[#121212] flex flex-col z-[110] border-r border-white/5 shrink-0 overflow-hidden w-[70px]">

      <div className="flex-1 py-2 flex flex-col justify-between min-h-0">
        <div className="rail space-y-1">
          {railNav.map((item) => (
            <RailButton
              key={item.id}
              item={item}
              active={active === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))}
        </div>
        <div className="rail-spacer flex-1 py-1" />
        <div className="rail space-y-1 pb-2">
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