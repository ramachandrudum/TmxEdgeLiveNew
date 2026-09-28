import { intBetween, varySeed } from '../lib/vary'

export type MonitorEventKind = 'incident' | 'deviation'

export type MonitorEvent = {
  kind: MonitorEventKind
  title: string
  when: string
  left: number
  width: number
  top: number
}

export type MonitorAsset = {
  id: string
  name: string
  status: 'cr' | 'ar' | 'ok'
  risk: number
  riskLevel: 'High' | 'Medium' | 'Low'
  on: boolean
  tasks: number
  height: number
  events: MonitorEvent[]
}

export const monitorDays = [
  { date: '22 Sept', weekday: 'Tue' },
  { date: '23 Sept', weekday: 'Wed' },
  { date: '24 Sept', weekday: 'Thu' },
  { date: '25 Sept', weekday: 'Fri' },
  { date: '26 Sept', weekday: 'Sat' },
  { date: '27 Sept', weekday: 'Sun' },
  { date: '28 Sept', weekday: 'Mon' },
]

export const monitorAssets: MonitorAsset[] = [
  {
    id: 'ch10',
    name: 'Chiller 10',
    status: 'cr',
    risk: 87,
    riskLevel: 'High',
    on: true,
    tasks: 3,
    height: 82,
    events: [
      { kind: 'incident', title: 'Specific Power High', when: '15/06, 1PM · 3h 10m', left: 76.19047619047619, width: 11.30952380952381, top: 17 },
      { kind: 'incident', title: 'Condenser Approach High', when: '15/06, 2PM · 2h 40m', left: 82.73809523809523, width: 13.690476190476192, top: 39 },
      { kind: 'deviation', title: 'Evaporator ΔT Deviation', when: '09/06, 5AM · 6d', left: 86.90476190476191, width: 1.1904761904761905, top: 61 },
    ],
  },
  {
    id: 'ch20',
    name: 'Chiller 20',
    status: 'ar',
    risk: 75,
    riskLevel: 'High',
    on: true,
    tasks: 2,
    height: 60,
    events: [
      { kind: 'incident', title: 'High Power Consumption', when: '14/06, 9:10AM · 5h', left: 24.404761904761905, width: 35.11904761904761, top: 17 },
      { kind: 'deviation', title: 'Chiller Load Deviation', when: '13/06, 2PM · 2d', left: 32.73809523809524, width: 10.119047619047619, top: 39 },
    ],
  },
  {
    id: 'ch30',
    name: 'Chiller 30',
    status: 'ok',
    risk: 22,
    riskLevel: 'Low',
    on: true,
    tasks: 1,
    height: 38,
    events: [
      { kind: 'deviation', title: 'Superheat Deviation', when: '13/06, 10AM · 2d', left: 89.88095238095238, width: 7.738095238095238, top: 17 },
    ],
  },
  {
    id: 'twa',
    name: 'Cooling Tower A',
    status: 'cr',
    risk: 78,
    riskLevel: 'High',
    on: true,
    tasks: 2,
    height: 38,
    events: [
      { kind: 'incident', title: 'Water Flow Drop', when: '12/06, 7AM · 3d', left: 24.404761904761905, width: 13.095238095238097, top: 17 },
      { kind: 'incident', title: 'CT Efficiency Drop', when: '15/06, 8:15AM · 6h', left: 61.30952380952381, width: 32.142857142857146, top: 17 },
    ],
  },
  {
    id: 'twb',
    name: 'Cooling Tower B',
    status: 'ok',
    risk: 12,
    riskLevel: 'Low',
    on: true,
    tasks: 3,
    height: 60,
    events: [
      { kind: 'deviation', title: 'Minor Approach Deviation', when: '14/06, 11AM · 1d', left: 3.571428571428571, width: 93.45238095238095, top: 17 },
      { kind: 'deviation', title: 'Fan Speed Deviation', when: '09/06, 8AM · 6d', left: 61.904761904761905, width: 33.92857142857143, top: 39 },
    ],
  },
  {
    id: 'p1',
    name: 'Primary Pump 1',
    status: 'ok',
    risk: 10,
    riskLevel: 'Low',
    on: true,
    tasks: 1,
    height: 38,
    events: [
      { kind: 'deviation', title: 'Motor Temp Deviation', when: '12/06, 3PM · 3d', left: 62.5, width: 1.1904761904761905, top: 17 },
    ],
  },
  {
    id: 'p3',
    name: 'Pump 3',
    status: 'ar',
    risk: 45,
    riskLevel: 'Medium',
    on: true,
    tasks: 2,
    height: 38,
    events: [
      { kind: 'deviation', title: 'Vibration Rising', when: '11/06, 5PM · 4d', left: 2.380952380952381, width: 25, top: 17 },
      { kind: 'incident', title: 'Low Flow Rate', when: '14/06, 7:20AM · 2h', left: 70.83333333333334, width: 2.380952380952381, top: 17 },
    ],
  },
  {
    id: 'c1',
    name: 'Compressor 1',
    status: 'ok',
    risk: 14,
    riskLevel: 'Low',
    on: true,
    tasks: 1,
    height: 38,
    events: [
      { kind: 'incident', title: 'Load Spike', when: '14/06, 6AM · 1d', left: 22.023809523809522, width: 4.166666666666666, top: 17 },
    ],
  },
  {
    id: 'c2',
    name: 'Compressor 2',
    status: 'cr',
    risk: 82,
    riskLevel: 'High',
    on: true,
    tasks: 2,
    height: 60,
    events: [
      { kind: 'incident', title: 'Risk of Failure', when: '15/06, 8:30AM · 4h', left: 1.1904761904761905, width: 92.26190476190477, top: 17 },
      { kind: 'incident', title: 'Power Draw High', when: '10/06, 11AM · 5d', left: 6.547619047619048, width: 42.26190476190476, top: 39 },
    ],
  },
  {
    id: 'c3',
    name: 'Compressor 3',
    status: 'ok',
    risk: 8,
    riskLevel: 'Low',
    on: true,
    tasks: 1,
    height: 38,
    events: [
      { kind: 'deviation', title: 'Minor Vibration Deviation', when: '11/06, 9AM · 4d', left: 52.38095238095239, width: 13.095238095238097, top: 17 },
    ],
  },
]

export const filterMonitorAssets = (names: string[]) =>
  monitorAssets.filter((asset) => names.includes(asset.name))

export type MonitorRow = {
  key: string
  asset: MonitorAsset
  event: MonitorEvent
  first: boolean
}

const WINDOW_START_MS = new Date(2026, 8, 22, 0, 0, 0, 0).getTime()
const DAY_MS = 86_400_000
const MIN_EVENT_MS = 4 * 60 * 60 * 1000

const pad = (n: number) => String(n).padStart(2, '0')

export const ganttStamp = (ms: number) => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const eventSpan = (event: MonitorEvent) => {
  const start = WINDOW_START_MS + (event.left / 100) * 7 * DAY_MS
  const endCandidate = WINDOW_START_MS + ((event.left + event.width) / 100) * 7 * DAY_MS
  return { start: ganttStamp(start), end: ganttStamp(Math.max(endCandidate, start + MIN_EVENT_MS)) }
}

export const ATRK_START = new Date(2026, 7, 30)
export const ATRK_TOTAL_DAYS = 30

export type TrackRow = {
  id: string
  name: string
  share: number
  color: string
  ticks: number[]
}

const buildTicks = (seed: string) => {
  const rnd = varySeed('ticks', seed)
  const ticks: number[] = Array.from({ length: ATRK_TOTAL_DAYS }, () => 0)
  const episodes = intBetween(rnd, 2, 3)
  for (let e = 0; e < episodes; e++) {
    const r = rnd()
    const level = r < 0.16 ? 3 : r < 0.45 ? 2 : 1
    const length = intBetween(rnd, 2, 6)
    const start = intBetween(rnd, 0, ATRK_TOTAL_DAYS - length)
    for (let i = start; i < start + length; i++) ticks[i] = Math.max(ticks[i], level)
  }
  return ticks
}

export const kpiRows: TrackRow[] = [
  { id: 'k1', name: 'Condenser Approach', share: 46, color: '#ef4444', ticks: buildTicks('Condenser Approach') },
  { id: 'k2', name: 'Evaporator ΔT', share: 26, color: '#f59e0b', ticks: buildTicks('Evaporator ΔT') },
  { id: 'k3', name: 'Specific Power', share: 15, color: '#3b82f6', ticks: buildTicks('Specific Power') },
  { id: 'k4', name: 'Superheat', share: 8, color: '#10b981', ticks: buildTicks('Superheat') },
  { id: 'k5', name: 'Others', share: 5, color: '#94a3b8', ticks: buildTicks('Others') },
]

const RISK_SHARES: [string, number][] = [
  ['Specific Power High', 21],
  ['Risk of Failure', 18],
  ['High Power Consumption', 15],
  ['Water Flow Drop', 12],
  ['CT Efficiency Drop', 11],
  ['Evaporator ΔT Deviation', 9],
  ['Vibration Rising', 7],
  ['Power Draw High', 4],
  ['Chiller Load Deviation', 3],
]

export const riskRows: TrackRow[] = RISK_SHARES.map(([name, share]) => ({
  id: `r-${name}`,
  name,
  share,
  color: share >= 15 ? '#ef4444' : share >= 8 ? '#f59e0b' : '#3b82f6',
  ticks: buildTicks(`risk-${name}`),
}))

export type HistoryRow = {
  id: string
  when: string
  type: 'incident' | 'task' | 'failure'
  title: string
  asset: string
  duration: string
  status: string
}

export const historyRows: HistoryRow[] = [
  { id: 'h1', when: '27 Sept, 14:05', type: 'incident', title: 'Specific Power High', asset: 'Chiller 10', duration: '3h 10m', status: 'Open' },
  { id: 'h2', when: '27 Sept, 15:00', type: 'incident', title: 'Condenser Approach High', asset: 'Chiller 10', duration: '2h 40m', status: 'Open' },
  { id: 'h3', when: '25 Sept, 08:30', type: 'incident', title: 'Risk of Failure', asset: 'Compressor 2', duration: '4h', status: 'Acknowledged' },
  { id: 'h4', when: '26 Sept, 11:20', type: 'task', title: 'Clean condenser tubes', asset: 'Chiller 10', duration: '—', status: 'In Progress' },
  { id: 'h5', when: '25 Sept, 09:05', type: 'task', title: 'Re-check fan belt tension', asset: 'Cooling Tower A', duration: '—', status: 'Done' },
  { id: 'h6', when: '23 Sept, 16:40', type: 'task', title: 'Vibration route walk', asset: 'Pump 3', duration: '—', status: 'Open' },
]
