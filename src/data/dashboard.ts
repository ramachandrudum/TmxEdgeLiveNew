export type Customer = {
  id: string
  name: string
  short: string
  color: string
  logo?: string
  sites: number
  units: number
  assets: number
  incidents: number
  tasks: number
  favorite: boolean
  recent: boolean
}

export const customers: Customer[] = [
  {
    id: 'nestle',
    name: 'Nestlé',
    short: 'NE',
    color: '#4C7A3F',
    logo: '/nestle.png',
    sites: 4,
    units: 8,
    assets: 40,
    incidents: 40,
    tasks: 24,
    favorite: true,
    recent: false,
  },
  {
    id: 'coke',
    name: 'Coca-Cola',
    short: 'CC',
    color: '#C1352A',
    sites: 3,
    units: 6,
    assets: 30,
    incidents: 30,
    tasks: 18,
    favorite: true,
    recent: false,
  },
  {
    id: 'unilever',
    name: 'Unilever',
    short: 'UL',
    color: '#1F4E79',
    sites: 3,
    units: 6,
    assets: 30,
    incidents: 30,
    tasks: 18,
    favorite: true,
    recent: false,
  },
  {
    id: 'pepsico',
    name: 'PepsiCo',
    short: 'PC',
    color: '#7A1F3D',
    sites: 4,
    units: 8,
    assets: 40,
    incidents: 40,
    tasks: 24,
    favorite: true,
    recent: false,
  },
  {
    id: 'pg',
    name: 'Procter & Gamble',
    short: 'PG',
    color: '#B8860B',
    sites: 2,
    units: 4,
    assets: 20,
    incidents: 20,
    tasks: 12,
    favorite: false,
    recent: true,
  },
  {
    id: 'danone',
    name: 'Danone',
    short: 'DN',
    color: '#0F6E6E',
    sites: 3,
    units: 6,
    assets: 30,
    incidents: 30,
    tasks: 18,
    favorite: true,
    recent: false,
  },
  {
    id: 'mondelez',
    name: 'Mondelez',
    short: 'MZ',
    color: '#5C2D91',
    sites: 2,
    units: 4,
    assets: 20,
    incidents: 20,
    tasks: 12,
    favorite: false,
    recent: true,
  },
  {
    id: 'colgate',
    name: 'Colgate-Palmolive',
    short: 'CP',
    color: '#C1447E',
    sites: 3,
    units: 6,
    assets: 30,
    incidents: 30,
    tasks: 18,
    favorite: false,
    recent: true,
  },
  {
    id: 'kraftheinz',
    name: 'Kraft Heinz',
    short: 'KH',
    color: '#8B3A1A',
    sites: 2,
    units: 4,
    assets: 20,
    incidents: 20,
    tasks: 12,
    favorite: false,
    recent: true,
  },
  {
    id: 'loreal',
    name: "L'Oréal",
    short: 'LO',
    color: '#4A4A4A',
    sites: 3,
    units: 6,
    assets: 30,
    incidents: 30,
    tasks: 18,
    favorite: false,
    recent: true,
  },
]

export const totalSummary = {
  customers: 10,
  sites: 29,
  units: 58,
  unitsOnline: 29,
  unitsOffline: 29,
  assets: 290,
  incidents: 290,
  tasks: 174,
  assetHealth: { critical: 47, atRisk: 65, healthy: 178, offenders: 65 },
  incidentsBreakdown: { critical: 61, warning: 78, deviation: 151 },
  tasksBreakdown: { overdue: 87, ongoing: 0, notStarted: 29, completed: 58 },
}

export type DashboardSummary = {
  customers: number
  sites: number
  units: number
  assets: number
  incidents: number
  tasks: number
  unitsOnline: number
  unitsOffline: number
  assetHealth: { critical: number; atRisk: number; healthy: number }
  incidentsBreakdown: { critical: number; warning: number; deviation: number }
  tasksBreakdown: { overdue: number; ongoing: number; notStarted: number; completed: number }
}

function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((acc, w) => acc + w, 0)
  if (sum <= 0 || total <= 0) {
    const parts = new Array(weights.length).fill(0)
    parts[0] = total
    return parts
  }

  const raw = weights.map((w) => (w / sum) * total)
  const parts = raw.map((v) => Math.floor(v))
  let remainder = total - parts.reduce((acc, p) => acc + p, 0)

  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac)

  let k = 0
  while (remainder > 0) {
    parts[order[k % order.length].i] += 1
    remainder -= 1
    k += 1
  }

  return parts
}

export function getCustomerSummary(customerId: string, variant = ''): DashboardSummary {
  const customer =
    customerId === 'all' ? undefined : customers.find((c) => c.id === customerId)

  if (!customer) {
    const rnd = seededRandom(hashSeed(`summary-all-${variant}`))
    const jitter = (base: number) => Math.max(1, Math.round(base * (0.7 + rnd() * 0.6)))
    const [unitsOffline, unitsOnline] = distribute(totalSummary.units, [
      jitter(totalSummary.unitsOffline),
      jitter(totalSummary.unitsOnline),
    ])
    const [aCrit, aRisk, aHealthy] = distribute(totalSummary.assets, [
      jitter(totalSummary.assetHealth.critical),
      jitter(totalSummary.assetHealth.atRisk),
      jitter(totalSummary.assetHealth.healthy),
    ])
    const [iCrit, iWarn, iDev] = distribute(totalSummary.incidents, [
      jitter(totalSummary.incidentsBreakdown.critical),
      jitter(totalSummary.incidentsBreakdown.warning),
      jitter(totalSummary.incidentsBreakdown.deviation),
    ])
    const [tOverdue, tNotStarted, tCompleted] = distribute(totalSummary.tasks, [
      jitter(totalSummary.tasksBreakdown.overdue),
      jitter(totalSummary.tasksBreakdown.notStarted),
      jitter(totalSummary.tasksBreakdown.completed),
    ])
    return {
      customers: customers.length,
      sites: totalSummary.sites,
      units: totalSummary.units,
      assets: totalSummary.assets,
      incidents: totalSummary.incidents,
      tasks: totalSummary.tasks,
      unitsOnline,
      unitsOffline,
      assetHealth: { critical: aCrit, atRisk: aRisk, healthy: aHealthy },
      incidentsBreakdown: { critical: iCrit, warning: iWarn, deviation: iDev },
      tasksBreakdown: { overdue: tOverdue, ongoing: 0, notStarted: tNotStarted, completed: tCompleted },
    }
  }

  const rnd = seededRandom(hashSeed(`summary-${customerId}-${variant}`))
  const jitter = (base: number) => base * (0.7 + rnd() * 0.6)

  const assetCount = Math.max(1, Math.round(customer.assets * (0.7 + rnd() * 0.6)))
  const incidentCount = Math.max(1, Math.round(customer.incidents * (0.7 + rnd() * 0.6)))
  const taskCount = Math.max(1, Math.round(customer.tasks * (0.7 + rnd() * 0.6)))

  const [aCrit, aRisk, aHealthy] = distribute(assetCount, [
    jitter(totalSummary.assetHealth.critical),
    jitter(totalSummary.assetHealth.atRisk),
    jitter(totalSummary.assetHealth.healthy),
  ])

  const [iCrit, iWarn, iDev] = distribute(incidentCount, [
    jitter(totalSummary.incidentsBreakdown.critical),
    jitter(totalSummary.incidentsBreakdown.warning),
    jitter(totalSummary.incidentsBreakdown.deviation),
  ])

  const [tOverdue, tNotStarted, tCompleted] = distribute(taskCount, [
    jitter(totalSummary.tasksBreakdown.overdue),
    jitter(totalSummary.tasksBreakdown.notStarted),
    jitter(totalSummary.tasksBreakdown.completed),
  ])

  const [unitsOffline, unitsOnline] = distribute(customer.units, [
    jitter(totalSummary.unitsOffline),
    jitter(totalSummary.unitsOnline),
  ])

  return {
    customers: 1,
    sites: customer.sites,
    units: customer.units,
    assets: assetCount,
    incidents: incidentCount,
    tasks: taskCount,
    unitsOnline,
    unitsOffline,
    assetHealth: { critical: aCrit, atRisk: aRisk, healthy: aHealthy },
    incidentsBreakdown: { critical: iCrit, warning: iWarn, deviation: iDev },
    tasksBreakdown: {
      overdue: tOverdue,
      ongoing: 0,
      notStarted: tNotStarted,
      completed: tCompleted,
    },
  }
}

export const budgetUnits = [
  { id: 'ums', name: 'UMS', icon: 'plug', active: true },
  { id: 'keepcooling', name: 'Just Cooling', icon: 'cpu' },
  { id: 'wws', name: 'WWS', icon: 'droplets' },
  { id: 'power', name: 'Power', icon: 'zap' },
  { id: 'heating', name: 'Heating', icon: 'flame' },
  { id: 'boilers', name: 'Boilers', icon: 'cylinder' },
  { id: 'tbwes', name: 'TBWES', icon: 'cpu' },
  { id: 'chemicals', name: 'Chemicals', icon: 'flask' },
  { id: 'enviro', name: 'Enviro', icon: 'leaf' },
  { id: 'tbspl', name: 'TBSPL', icon: 'package' },
  { id: 'fepl', name: 'FEPL', icon: 'sun' },
  { id: 'ems', name: 'EMS', icon: 'dashboard' },
  { id: 'oilgas', name: 'Oil & Gas', icon: 'fuel' },
]

export const sites = [
  {
    id: 'arctic-chill-hub',
    name: 'Arctic Chill Hub',
    unitsOnline: 2,
    unitsOffline: 0,
    assets: 25,
    incidents: 1,
    tasks: 5,
    availability: { value: 100, delta: -5 },
    trips: 6,
    shutdown: 0,
    pmActivity: 5,
  },
  {
    id: 'nordic-cold-storage',
    name: 'Nordic Cold Storage',
    unitsOnline: 1,
    unitsOffline: 1,
    assets: 20,
    incidents: 2,
    tasks: 5,
    availability: { value: 50, delta: -3 },
    trips: 6,
    shutdown: 0,
    pmActivity: 5,
  },
]

export type UnitStat = {
  id: string
  name: string
  status: 'healthy' | 'critical' | 'offline'
  health: number
  delta: number
  updated: string
  assets: { total: number; healthy: number; critical: number; offline: number }
  incidents: { total: number; critical: number; warning: number; deviation: number }
  tasks: { total: number; overdue: number; open: number; completed: number }
  trips: { total: number; planned: number; unplanned: number }
  pmActivity: number
  shutdown: number
}

export type SiteLegend = { label: string; value: number; color: string }

export type SiteStat = {
  id: string
  name: string
  updated: string
  units: number
  assets: { value: number; legends: SiteLegend[] }
  incidents: { value: number; legends: SiteLegend[] }
  tasks: { value: number; legends: SiteLegend[] }
  unitList: UnitStat[]
}

const corpNames: Record<string, string> = {
  nestle: 'Nestle',
  coke: 'Coca-Cola',
  unilever: 'Unilever',
  pepsico: 'PepsiCo',
  pg: 'Procter',
  danone: 'Danone',
  mondelez: 'Mondelez',
  colgate: 'Colgate',
  kraftheinz: 'Kraft',
  loreal: "L'Oreal",
}

const cities = [
  'UAE',
  'Cairo',
  'Lagos',
  'Riyadh',
  'Singapore',
  'Dubai',
  'Kuala Lumpur',
  'Shenzhen',
  'Monterrey',
  'Nairobi',
  'Jakarta',
  'Mumbai',
  'Bangkok',
  'Manila',
]

const plantTypes = ['Plant', 'Facility', 'Hub', 'Campus', 'Logistics Center', 'Factory']

function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0
  }
  return h
}

function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const unitNames = [
  'HVAC',
  'Compressors',
  'Chillers',
  'Boilers',
  'Process Pumps',
  'Cooling Tower',
  'Air Handling Units',
  'Generators',
]

function generateUnits(seedKey: string, count: number, variant = ''): UnitStat[] {
  const rnd = seededRandom(hashSeed(`${seedKey}-units-${variant}`))
  const ago = () => `${1 + Math.floor(rnd() * 12)}m ago`

  return Array.from({ length: count }, (_, u) => {
    const assetsTotal = 3 + Math.floor(rnd() * 7)
    const aCrit = Math.floor(rnd() * 3)
    const aOffline = Math.floor(rnd() * 2)
    const aHealthy = Math.max(0, assetsTotal - aCrit - aOffline)

    const isLast = u === count - 1
    const health = isLast ? 0 : Math.round((aHealthy / assetsTotal) * 100)
    const status: UnitStat['status'] = isLast ? 'offline' : 'healthy'

    const incidentsTotal = 2 + Math.floor(rnd() * 7)
    const iCrit = Math.floor(rnd() * (incidentsTotal + 1))
    const iWarn = Math.floor(rnd() * (incidentsTotal - iCrit + 1))
    const iDev = incidentsTotal - iCrit - iWarn

    const tasksTotal = 1 + Math.floor(rnd() * 6)
    const tOverdue = Math.floor(rnd() * (tasksTotal + 1))
    const tOpen = Math.floor(rnd() * (tasksTotal - tOverdue + 1))
    const tCompleted = tasksTotal - tOverdue - tOpen

    const delta = -(1 + Math.floor(rnd() * 8))
    const tripsTotal = Math.floor(rnd() * 12)
    const tripsPlanned = Math.floor(rnd() * (tripsTotal + 1))
    const tripsUnplanned = tripsTotal - tripsPlanned
    const pmActivity = Math.floor(rnd() * 5)
    const shutdown = Math.floor(rnd() * 2)

    return {
      id: `${seedKey}-unit-${u}`,
      name: isLast ? 'Chillers' : unitNames[u % unitNames.length],
      status,
      health,
      delta,
      updated: ago(),
      assets: { total: assetsTotal, healthy: aHealthy, critical: aCrit, offline: aOffline },
      incidents: { total: incidentsTotal, critical: iCrit, warning: iWarn, deviation: iDev },
      tasks: { total: tasksTotal, overdue: tOverdue, open: tOpen, completed: tCompleted },
      trips: { total: tripsTotal, planned: tripsPlanned, unplanned: tripsUnplanned },
      pmActivity,
      shutdown,
    }
  })
}

export function generateSites(customerId: string, variant = ''): SiteStat[] {
  const rnd = seededRandom(hashSeed(`${customerId}-${variant}`))
  const corp = corpNames[customerId] ?? 'Corp'
  const count = 2 + Math.floor(rnd() * 3)

  const pick = (arr: string[]) => arr[Math.floor(rnd() * arr.length)]
  const split = (total: number): [number, number, number] => {
    const a = Math.floor(rnd() * (total + 1))
    const b = Math.floor(rnd() * (total - a + 1))
    return [a, b, total - a - b]
  }

  return Array.from({ length: count }, (_, i) => {
    const assetsTotal = 8 + Math.floor(rnd() * 7)
    const [aCrit, aRisk, aHealthy] = split(assetsTotal)
    const incidentsTotal = 6 + Math.floor(rnd() * 9)
    const [iCrit, iWarn, iDev] = split(incidentsTotal)
    const tasksTotal = 4 + Math.floor(rnd() * 6)
    const [tOver, tOpen, tDone] = split(tasksTotal)

    const name =
      i === 0
        ? `${corp} ${pick(cities)}`
        : `${pick(cities)} ${pick(plantTypes)}`

    const siteId = `${customerId}-site-${i}`
    const units = 1 + Math.floor(rnd() * 3)

    return {
      id: siteId,
      name,
      updated: `${1 + (hashSeed(`${siteId}-${variant}`) % 12)}m ago`,
      units,
      unitList: generateUnits(siteId, units, variant),
      assets: {
        value: assetsTotal,
        legends: [
          { label: 'Healthy', value: aHealthy, color: 'var(--gm)' },
          { label: 'At Risk', value: aRisk, color: 'var(--aym)' },
          { label: 'Critical', value: aCrit, color: 'var(--rm)' },
        ],
      },
      incidents: {
        value: incidentsTotal,
        legends: [
          { label: 'Critical', value: iCrit, color: 'var(--rm)' },
          { label: 'Warning', value: iWarn, color: 'var(--am)' },
          { label: 'Deviation', value: iDev, color: '#ffc107' },
        ],
      },
      tasks: {
        value: tasksTotal,
        legends: [
          { label: 'Overdue', value: tOver, color: 'var(--rm)' },
          { label: 'Open', value: tOpen, color: 'var(--am)' },
          { label: 'Completed', value: tDone, color: 'var(--gm)' },
        ],
      },
    }
  })
}