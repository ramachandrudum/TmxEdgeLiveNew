export type NodeStatus = 'cr' | 'ar' | 'ok' | 'off' | 'wr' | 'dv'

export const DOT_COLOR: Record<NodeStatus, string> = {
  cr: 'var(--rm)',
  ar: 'var(--aym)',
  ok: 'var(--gm)',
  off: 'var(--tt)',
  wr: 'var(--am)',
  dv: '#ffc107',
}

export type TreeNode = {
  id: string
  name: string
  status?: NodeStatus
  kind: 'site' | 'unit' | 'system' | 'asset'
  children?: TreeNode[]
}

export const hierarchy: TreeNode = {
  id: 'site',
  name: 'Nestle UAE',
  kind: 'site',
  children: [
    {
      id: 'HVAC',
      name: 'HVAC',
      kind: 'unit',
      children: [
        {
          id: 'pcs',
          name: 'Primary Cooling Water System',
          kind: 'system',
          children: [
            { id: 'ch10', name: 'Chiller 10', status: 'cr', kind: 'asset' },
            { id: 'ch20', name: 'Chiller 20', status: 'ar', kind: 'asset' },
            { id: 'ch30', name: 'Chiller 30', status: 'ok', kind: 'asset' },
            { id: 'twa', name: 'Cooling Tower A', status: 'cr', kind: 'asset' },
            { id: 'twb', name: 'Cooling Tower B', status: 'ok', kind: 'asset' },
            { id: 'p1', name: 'Primary Pump 1', status: 'ok', kind: 'asset' },
          ],
        },
        {
          id: 'scs',
          name: 'Secondary Cooling Water System',
          kind: 'system',
          children: [{ id: 'p3', name: 'Pump 3', status: 'ar', kind: 'asset' }],
        },
        { id: 'cwc', name: 'Cooling Water Condensor', kind: 'system', children: [] },
      ],
    },
    {
      id: 'Compressors',
      name: 'Compressors',
      kind: 'unit',
      children: [
        {
          id: 'cs1',
          name: 'Compressor System 1',
          kind: 'system',
          children: [
            { id: 'c1', name: 'Compressor 1', status: 'ok', kind: 'asset' },
            { id: 'c2', name: 'Compressor 2', status: 'cr', kind: 'asset' },
          ],
        },
        {
          id: 'cs2',
          name: 'Compressor System 2',
          kind: 'system',
          children: [{ id: 'c3', name: 'Compressor 3', status: 'ok', kind: 'asset' }],
        },
      ],
    },
  ],
}

export const otherSites = ['Cairo Plant', 'Lagos Plant', 'Riyadh Plant']

export type Kpi = {
  label: string
  value: string
  unit: string
  delta: string
  deltaColor: string
  color: string
  path: string
}

export const kpis: Kpi[] = [
  {
    label: 'Power Consumption',
    value: '12.4',
    unit: 'MWh',
    delta: '▲ 10%',
    deltaColor: 'var(--r)',
    color: '#0968db',
    path: 'M0,4 L18,6 L36,11 L54,11 L72,5 L90,6 L108,18 L126,20 L144,14 L162,15 L180,24 L198,24 L210,18 L220,17',
  },
  {
    label: 'Thermal Consumption',
    value: '38.2',
    unit: 'GJ',
    delta: '▲ 10%',
    deltaColor: 'var(--r)',
    color: '#0968db',
    path: 'M0,16 L18,15 L36,7 L54,8 L72,24 L90,24 L108,5 L126,4 L144,15 L162,16 L180,7 L198,8 L210,18 L220,20',
  },
  {
    label: 'Water Consumption',
    value: '1909',
    unit: 'TCO₂',
    delta: '▲ 10%',
    deltaColor: 'var(--r)',
    color: '#0968db',
    path: 'M0,4 L18,5 L36,12 L54,13 L72,5 L90,7 L108,23 L126,24 L144,16 L162,15 L180,22 L198,21 L210,12 L220,10',
  },
  {
    label: 'GHG Emissions',
    value: '18.5',
    unit: 'TCO₂e',
    delta: '▲ 10%',
    deltaColor: 'var(--r)',
    color: '#0968db',
    path: 'M0,18 L18,17 L36,12 L54,13 L72,24 L90,24 L108,11 L126,10 L144,16 L162,15 L180,5 L198,4 L210,11 L220,13',
  },
  {
    label: 'Savings',
    value: '₹3.42',
    unit: 'Lakhs',
    delta: '▲ 10%',
    deltaColor: 'var(--g)',
    color: '#0968db',
    path: 'M0,4 L18,5 L36,5 L54,7 L72,12 L90,13 L108,9 L126,10 L144,17 L162,18 L180,15 L198,16 L210,23 L220,24',
  },
]

export const TREND_PATH =
  'M30,146.6C40.0,138.7 70.2,106.4 90.3,99.0C110.4,91.6 130.5,105.8 150.6,102.4C170.7,99.0 190.8,86.0 210.9,78.6C231.0,71.2 251.0,60.5 271.1,58.2C291.2,55.9 311.3,68.4 331.4,65.0C351.5,61.6 371.6,46.3 391.7,37.8C411.8,29.3 442.0,18.0 452.0,14.0'

export const TREND_X = ['27/08', '28/08', '29/08', '30/08', '31/08', '01/09']
export const TREND_Y = [
  { label: '7', top: '6.67%' },
  { label: '4', top: '47.14%' },
  { label: '0', top: '87.62%' },
]

export const kpiStatus = {
  total: 50,
  healthy: 46,
  unhealthy: 4,
  items: [
    { name: 'Condenser Approach High', bad: true, count: 2 },
    { name: 'Specific Power High', bad: true, count: 2 },
    { name: 'Condenser Approach High', bad: true, count: 2 },
    { name: 'Specific Power High', bad: true, count: 2 },
    ...(
      [
        'Condenser Approach',
        'Evaporator ΔT',
        'Specific Power',
        'Superheat',
        'Condenser Approach',
        'Evaporator Temp',
        'Condenser Approach',
        'Power Draw',
        'Chiller Load',
        'Evaporator Temp',
        'Condenser Approach',
        'Condenser Approach',
        'Power Draw',
        'Chiller Load',
        'Superheat',
        'Condenser Approach',
        'Power Draw',
        'Chiller Load',
        'Superheat',
        'Condenser Approach',
        'Water Flow',
        'Approach Temp',
        'Approach Temp',
        'Fan Speed',
        'Efficiency',
        'Water Flow',
        'Approach Temp',
        'Fan Speed',
        'Efficiency',
        'Water Flow',
        'Approach Temp',
        'Flow Rate',
        'Vibration',
        'Motor Temp',
        'Power Draw',
        'Flow Rate',
        'Vibration',
        'Motor Temp',
        'Power Draw',
        'Flow Rate',
        'Vibration',
        'Motor Temp',
        'Power Draw',
        'Flow Rate',
        'Vibration',
        'Motor Temp',
      ] as string[]
    ).map((name) => ({ name, bad: false, count: 0 })),
  ],
}

export type MiniDonut = {
  title: string
  total: number
  legends: { label: string; value: number; color: string }[]
  gradient: string
}

export const miniDonuts: MiniDonut[] = [
  {
    title: 'Assets',
    total: 10,
    legends: [
      { label: 'Critical', value: 3, color: 'var(--rm)' },
      { label: 'At Risk', value: 2, color: 'var(--aym)' },
      { label: 'Healthy', value: 5, color: 'var(--gm)' },
    ],
    gradient:
      'conic-gradient(var(--rm) 0deg 108deg, var(--aym) 108deg 180deg, var(--gm) 180deg 360deg)',
  },
  {
    title: 'Incidents',
    total: 7,
    legends: [
      { label: 'Critical', value: 3, color: 'var(--rm)' },
      { label: 'Warning', value: 3, color: 'var(--am)' },
      { label: 'Deviation', value: 1, color: '#ffc107' },
    ],
    gradient:
      'conic-gradient(var(--rm) 0deg 154.3deg, var(--am) 154.3deg 308.6deg, #ffc107 308.6deg 360deg)',
  },
  {
    title: 'Tasks',
    total: 5,
    legends: [
      { label: 'Overdue', value: 1, color: 'var(--rm)' },
      { label: 'Ongoing', value: 2, color: 'var(--aym)' },
      { label: 'Not Started', value: 1, color: 'var(--tt)' },
      { label: 'Completed', value: 1, color: 'var(--gm)' },
    ],
    gradient:
      'conic-gradient(var(--rm) 0deg 72deg, var(--aym) 72deg 216deg, var(--tt) 216deg 288deg, var(--gm) 288deg 360deg)',
  },
]

export type AssetCard = {
  id: string
  name: string
  status: NodeStatus
  risk: number
  delta: string
  segs: { rm: number; aym: number; gm: number }
  path: string[]
}

export const assetCards: AssetCard[] = [
  { id: 'ch10', name: 'Chiller 10', status: 'cr', risk: 87, delta: '▲ 9%', segs: { rm: 3, aym: 1, gm: 5 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'c2', name: 'Compressor 2', status: 'cr', risk: 82, delta: '▲ 4%', segs: { rm: 3, aym: 2, gm: 4 }, path: ['Nestle UAE', 'Compressors', 'Compressor System 1'] },
  { id: 'twa', name: 'Cooling Tower A', status: 'cr', risk: 78, delta: '▲ 10%', segs: { rm: 2, aym: 1, gm: 2 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'ch20', name: 'Chiller 20', status: 'ar', risk: 75, delta: '▲ 7%', segs: { rm: 2, aym: 1, gm: 6 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'p3', name: 'Pump 3', status: 'ar', risk: 45, delta: '▲ 7%', segs: { rm: 0, aym: 1, gm: 8 }, path: ['Nestle UAE', 'HVAC', 'Secondary Cooling Water System'] },
  { id: 'ch30', name: 'Chiller 30', status: 'ok', risk: 22, delta: '▲ 4%', segs: { rm: 0, aym: 0, gm: 9 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'c1', name: 'Compressor 1', status: 'ok', risk: 14, delta: '▲ 6%', segs: { rm: 0, aym: 0, gm: 6 }, path: ['Nestle UAE', 'Compressors', 'Compressor System 1'] },
  { id: 'twb', name: 'Cooling Tower B', status: 'ok', risk: 12, delta: '▲ 4%', segs: { rm: 0, aym: 0, gm: 9 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'p1', name: 'Primary Pump 1', status: 'ok', risk: 10, delta: '▲ 2%', segs: { rm: 0, aym: 0, gm: 14 }, path: ['Nestle UAE', 'HVAC', 'Primary Cooling Water System'] },
  { id: 'c3', name: 'Compressor 3', status: 'ok', risk: 8, delta: '▲ 10%', segs: { rm: 0, aym: 0, gm: 20 }, path: ['Nestle UAE', 'Compressors', 'Compressor System 2'] },
]

export type IncidentCard = {
  id: string
  time: string
  badge?: string
  status: NodeStatus
  title: string
  kpiLabel: string
  kpiValue: string
  kpiDelta?: string
  sensors?: number
  cause?: string
  path: string[]
}

export const incidentCards: IncidentCard[] = [
  {
    id: 'i1',
    time: '15/06, 2PM',
    badge: 'New',
    status: 'cr',
    title: 'Condenser Approach High',
    kpiLabel: '',
    kpiValue: '',
    sensors: 2,
    cause:
      'Fouled condenser tubes or reduced condenser water flow. Clean condenser tubes and verify cooling water flow rate.',
    path: ['Nestle UAE', 'HVAC', 'Chiller 10'],
  },
  { id: 'i2', time: '15/06, 1PM', status: 'cr', title: 'Specific Power High', kpiLabel: 'Energy Cost', kpiValue: '+12%', kpiDelta: '↑12%', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 'i3', time: '14/06, 9:10AM', badge: 'New Updates (2)', status: 'wr', title: 'High Power Consumption', kpiLabel: 'Power Draw', kpiValue: '98 kW', kpiDelta: '↑18%', path: ['Nestle UAE', 'HVAC', 'Chiller 20'] },
  { id: 'i4', time: '15/06, 8:15AM', status: 'cr', title: 'CT Efficiency Drop', kpiLabel: 'Approach Temp', kpiValue: '5.4 °C', kpiDelta: '↑11%', path: ['Nestle UAE', 'HVAC', 'Cooling Tower A'] },
  { id: 'i5', time: '14/06, 11AM', status: 'dv', title: 'Minor Approach Deviation', kpiLabel: 'Approach Temp', kpiValue: '3.9 °C', kpiDelta: '↑3%', path: ['Nestle UAE', 'HVAC', 'Cooling Tower B'] },
  { id: 'i6', time: '14/06, 7:20AM', status: 'wr', title: 'Low Flow Rate', kpiLabel: 'Flow Rate', kpiValue: '142 m³/h', kpiDelta: '↓14%', path: ['Nestle UAE', 'HVAC', 'Pump 3'] },
  { id: 'i7', time: '15/06, 8:30AM', status: 'wr', title: 'Risk of Failure', kpiLabel: '', kpiValue: '', sensors: 2, path: ['Nestle UAE', 'Compressors', 'Compressor 2'] },
]

export type TaskCard = {
  id: string
  status: NodeStatus
  name: string
  due: string
  avatar: string
  path: string[]
}

export const taskCards: TaskCard[] = [
  { id: 't1', status: 'cr', name: 'Preventive maintenance overdue', due: 'Overdue 3 days', avatar: 'RK', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 't2', status: 'ar', name: 'Inspect condenser tubes', due: 'Due in 2 days', avatar: 'PS', path: ['Nestle UAE', 'HVAC', 'Chiller 10'] },
  { id: 't3', status: 'off', name: 'Fan speed optimization review', due: 'Not started · due in 5 days', avatar: 'PS', path: ['Nestle UAE', 'HVAC', 'Cooling Tower A'] },
  { id: 't4', status: 'ok', name: 'Filter replacement', due: 'Completed 2 days ago', avatar: 'RK', path: ['Nestle UAE', 'HVAC', 'Cooling Tower B'] },
  { id: 't5', status: 'ar', name: 'Inspect compressor bearings', due: 'Due today', avatar: 'PS', path: ['Nestle UAE', 'Compressors', 'Compressor 2'] },
]
