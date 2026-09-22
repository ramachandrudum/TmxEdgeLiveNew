import {
  Cpu,
  Cylinder,
  Droplets,
  Flame,
  FlaskConical,
  Fuel,
  LayoutDashboard,
  LayoutGrid,
  Leaf,
  Package,
  Plug,
  Sun,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const icons: Record<string, LucideIcon> = {
  grid: LayoutGrid,
  cpu: Cpu,
  plug: Plug,
  droplets: Droplets,
  zap: Zap,
  flame: Flame,
  cylinder: Cylinder,
  flask: FlaskConical,
  leaf: Leaf,
  package: Package,
  sun: Sun,
  dashboard: LayoutDashboard,
  fuel: Fuel,
}

export type BUItem = {
  id: string
  name: string
  icon: string
}

type Props = {
  items: BUItem[]
  active: string
  onSelect: (id: string) => void
  onCollapse?: () => void
  gradient?: boolean
}

export default function BUBar({ items, active, onSelect, onCollapse, gradient = true }: Props) {
  return (
    <div
      className="flex-shrink-0 h-[45px] border-b border-gray-200 flex items-stretch"
      style={gradient ? { background: 'radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0b2c6e 55%, #000000 100%)' } : { background: '#F9FAFC' }}
    >
      {onCollapse && (
        <button
          onClick={onCollapse}
          title="Hide BU bar"
          className="w-10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M6,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM6,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM12,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM16,6c0,1.1 0.9,2 2,2s2,-0.9 2,-2 -0.9,-2 -2,-2 -2,0.9 -2,2zM12,8c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,14c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2zM18,20c1.1,0 2,-0.9 2,-2s-0.9,-2 -2,-2 -2,0.9 -2,2 0.9,2 2,2z"></path>
          </svg>
        </button>
      )}
      <div className="flex items-center gap-0 overflow-x-auto flex-1 no-scrollbar">
        <div className="flex items-center gap-0 flex-1 justify-center overflow-x-auto no-scrollbar h-full">
          {items.map((item) => {
            const Icon = icons[item.icon] ?? LayoutGrid
            const isActive = item.id === active
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`relative flex items-center justify-center px-5 h-full whitespace-nowrap transition-all min-w-[85px] cursor-pointer ${
                  gradient ? 'pt-[5px] pb-[5px] gap-[3px] flex-col' : ''
                } ${
                  isActive
                    ? gradient
                      ? 'bg-[#ECF2FA] text-blue-600 border-transparent'
                      : 'text-blue-600 border-b-2 border-blue-600'
                    : gradient
                      ? 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                      : 'text-gray-600 border-transparent hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {gradient && <Icon className="w-4 h-4 shrink-0" />}
                <span className={`${gradient ? 'text-xs leading-none tracking-wide' : 'text-[13px] font-medium'} ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}