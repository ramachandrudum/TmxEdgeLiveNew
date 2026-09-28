export type CalendarCategory = 'tasks' | 'incidents' | 'maintenance' | 'failure'

export type CalendarEvent = {
  id: string
  cat: CalendarCategory
  title: string
  desc?: string
  date: string
  start: string
  end: string
}

export const CALENDAR_CATEGORIES: { id: CalendarCategory; label: string; color: string; bg: string }[] = [
  { id: 'tasks', label: 'Tasks', color: '#007bff', bg: '#d2e0ff' },
  { id: 'incidents', label: 'Incidents', color: '#dc3545', bg: '#ffd5cc' },
  { id: 'maintenance', label: 'Maintenance activity', color: '#28a745', bg: '#cbfbb0' },
  { id: 'failure', label: 'Failure', color: '#fd7e14', bg: '#ffecca' },
]

export const CATEGORY_META: Record<CalendarCategory, { color: string; bg: string }> = CALENDAR_CATEGORIES.reduce(
  (acc, c) => {
    acc[c.id] = { color: c.color, bg: c.bg }
    return acc
  },
  {} as Record<CalendarCategory, { color: string; bg: string }>,
)

export const calendarEvents: CalendarEvent[] = [
  { id: 't1', cat: 'tasks', title: 'Inspect Cooling Tower Fans', desc: 'Overdue by 1d 4h · Cooling Tower A', date: '2026-09-28', start: '10:00', end: '11:00' },
  { id: 't2', cat: 'tasks', title: 'Weekly vibration check', desc: 'Primary Pump 1 · route A', date: '2026-09-02', start: '09:00', end: '10:30' },
  { id: 't3', cat: 'tasks', title: 'Update shift logbook', desc: 'Handover notes for night shift', date: '2026-09-09', start: '18:00', end: '18:30' },
  { id: 't4', cat: 'tasks', title: 'Calibrate flow sensor', desc: 'BWRO common line · calibration kit required', date: '2026-09-15', start: '11:00', end: '12:30' },
  { id: 't5', cat: 'tasks', title: 'Chiller 10 preventive maintenance', desc: 'All tasks for August 2026 are completed', date: '2026-09-23', start: '08:30', end: '09:30' },
  { id: 't6', cat: 'tasks', title: 'Close overdue work orders', desc: '7 open work orders to review', date: '2026-10-01', start: '14:00', end: '15:00' },

  { id: 'i1', cat: 'incidents', title: 'Evaporator ΔT Deviation', desc: 'Chiller 10 · deviation above threshold', date: '2026-09-22', start: '11:04', end: '12:00' },
  { id: 'i2', cat: 'incidents', title: 'High vibration alarm', desc: 'Compressor 2 · 8.4 mm/s RMS', date: '2026-09-04', start: '13:15', end: '14:00' },
  { id: 'i3', cat: 'incidents', title: 'Water flow drop', desc: 'Cooling Tower A · flow below setpoint', date: '2026-09-11', start: '16:20', end: '17:10' },
  { id: 'i4', cat: 'incidents', title: 'Compressor Specific Power High', desc: 'Compressor 3 · 2.23 kW/CFM ▲10%', date: '2026-09-28', start: '09:00', end: '10:00' },
  { id: 'i5', cat: 'incidents', title: 'High ORP in SWRO feed', desc: 'ORP 273.6 mV · chemical dosing review', date: '2026-09-18', start: '09:19', end: '10:15' },
  { id: 'i6', cat: 'incidents', title: 'Condenser Approach High', desc: 'Chiller 20 · approach 6.2°C', date: '2026-10-02', start: '07:45', end: '08:45' },

  { id: 'm1', cat: 'maintenance', title: 'Bearing lubrication · Pump 3', desc: 'Scheduled greasing of motor bearings', date: '2026-09-03', start: '10:00', end: '12:00' },
  { id: 'm2', cat: 'maintenance', title: 'Cooling tower cleaning', desc: 'Basin wash and nozzle inspection', date: '2026-09-08', start: '08:00', end: '13:00' },
  { id: 'm3', cat: 'maintenance', title: 'Filter cartridge replacement', desc: 'BWRO cartridge filter 2 anomaly follow-up', date: '2026-09-16', start: '14:00', end: '16:00' },
  { id: 'm4', cat: 'maintenance', title: 'Quarterly instrument inspection', desc: 'All field transmitters · loop check', date: '2026-09-25', start: '09:00', end: '17:00' },
  { id: 'm5', cat: 'maintenance', title: 'Valve packing replacement', desc: 'Cooling water condenser inlet valve', date: '2026-09-30', start: '13:00', end: '15:30' },
  { id: 'm6', cat: 'maintenance', title: 'Oil analysis sampling', desc: 'Compressor 1 & 2 · sample points', date: '2026-10-05', start: '10:30', end: '11:30' },

  { id: 'f1', cat: 'failure', title: 'CT fan motor failure', desc: 'Cooling Tower B · fan motor trips', date: '2026-09-05', start: '15:30', end: '17:00' },
  { id: 'f2', cat: 'failure', title: 'Temperature sensor board failure', desc: 'Chiller 30 · AI card replaced', date: '2026-09-12', start: '11:00', end: '12:00' },
  { id: 'f3', cat: 'failure', title: 'Valve actuator jam', desc: 'Secondary cooling water · actuator removed', date: '2026-09-21', start: '16:00', end: '18:00' },
  { id: 'f4', cat: 'failure', title: 'Low flow trip', desc: 'Pump 3 · check valve fouling', date: '2026-09-29', start: '06:30', end: '08:00' },
  { id: 'f5', cat: 'failure', title: 'VFD drive fault', desc: 'Compressor 1 · DC bus undervoltage', date: '2026-10-03', start: '12:00', end: '14:00' },
]
