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
}

export default function BUBar({ items, active, onSelect }: Props) {
  return (
    <div className="bg-[#F9FAFC] flex-shrink-0 h-[52px] border-b border-gray-200">
      <div className="flex items-center gap-0 overflow-x-auto h-full no-scrollbar">
        <div className="flex items-center gap-0 flex-1 justify-center overflow-x-auto no-scrollbar h-full">
          {items.map((item) => {
            const Icon = icons[item.icon] ?? LayoutGrid
            const isActive = item.id === active
            return (
              <button
                key={item.id}
                onClick={() => onSelect(item.id)}
                className={`relative flex flex-col items-center justify-center px-5 h-full whitespace-nowrap transition-all min-w-[85px] cursor-pointer border-b-2 ${
                  isActive
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4 mb-0.5 shrink-0" />
                <span className={`text-[10px] tracking-wide ${isActive ? 'font-bold' : 'font-normal'}`}>
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