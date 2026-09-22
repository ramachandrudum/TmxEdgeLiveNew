import type { SiteStat } from '../data/dashboard'

const CELL = 'py-3 px-3 align-top'

function Legends({ items }: { items: { label: string; value: number; color: string }[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center mt-1.5">
      {items.map((l) => (
        <span key={l.label} className="inline-flex items-center gap-1 whitespace-nowrap">
          <span className="w-2 h-2 rounded-[3px] shrink-0" style={{ background: l.color }} />
          <span className="text-[10px] text-gray-500 font-medium">{l.label}</span>
          <span className="text-[11px] text-gray-800 font-semibold">{l.value}</span>
        </span>
      ))}
    </div>
  )
}

export default function SiteSummaryRow({ site }: { site: SiteStat }) {
  const avail = site.unitList.length
    ? Math.round(site.unitList.reduce((acc, u) => acc + u.health, 0) / site.unitList.length)
    : 0
  const trips = site.unitList.reduce((acc, u) => ({
    total: acc.total + u.trips.total,
    planned: acc.planned + u.trips.planned,
    unplanned: acc.unplanned + u.trips.unplanned,
  }), { total: 0, planned: 0, unplanned: 0 })
  const pm = site.unitList.length
    ? Math.round(site.unitList.reduce((acc, u) => acc + u.pmActivity, 0) / site.unitList.length)
    : 0
  const shutdown = site.unitList.reduce((acc, u) => acc + u.shutdown, 0)

  return (
    <tr className="bg-[#F0F7FF] border-b border-gray-100 group/site-summary cursor-pointer">
      <td className={`${CELL} align-middle`} style={{ paddingLeft: 50 }}>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-gray-900 text-sm font-semibold">{site.name}</div>
            <div className="text-[11px] text-gray-500 font-medium">Site Summary · {site.units} {site.units === 1 ? 'Unit' : 'Units'}</div>
          </div>
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-[#0968DB] font-semibold text-base">{avail}%</span>
          <span className="text-[10px] text-gray-500 font-medium">Avg</span>
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{site.assets.value}</span>
          <Legends items={site.assets.legends} />
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{site.incidents.value}</span>
          <Legends items={site.incidents.legends} />
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{site.tasks.value}</span>
          <Legends items={site.tasks.legends} />
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{trips.total}</span>
          <Legends items={[
            { label: 'Planned', value: trips.planned, color: 'var(--gm)' },
            { label: 'Unplanned', value: trips.unplanned, color: 'var(--rm)' },
          ]} />
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{pm ? `${pm}%` : '-'}</span>
          <span className="text-[10px] text-gray-500 font-medium">Avg</span>
        </div>
      </td>
      <td className={`${CELL} text-center`}>
        <div className="flex flex-col items-center">
          <span className="text-gray-900 text-base font-semibold">{shutdown}</span>
          <span className="text-[10px] text-gray-500 font-medium">Units</span>
        </div>
      </td>
      <td className={`${CELL} align-middle`}>
        <span className="relative flex items-center justify-center w-8 h-8">
          <span className="absolute inset-0 rounded-full bg-blue-500/30 opacity-0 group-hover/site-summary:animate-ping" />
        </span>
      </td>
    </tr>
  )
}