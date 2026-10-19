export const compareTypes = [
  { id: 'site', label: 'Compare Sites', desc: 'Compare KPIs across sites', icon: 'M12 22s7-7.58 7-12A7 7 0 0 0 5 10c0 4.42 7 12 7 12Z' },
  { id: 'unit', label: 'Compare Units', desc: 'Compare KPIs across units', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' },
  { id: 'system', label: 'Compare Systems', desc: 'Compare KPIs across systems', icon: 'M3 3h18v18H3z' },
  { id: 'asset', label: 'Compare Assets', desc: 'Compare KPIs across individual assets', icon: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z' },
]

export const compareItems: Record<string, string[]> = {
  site: ['Nestle UAE', 'Cairo Plant', 'Lagos Plant', 'Riyadh Plant'],
  unit: ['HVAC', 'Compressors'],
  system: ['Primary Cooling Water System', 'Secondary Cooling Water System', 'Cooling Water Condensor', 'Compressor System 1', 'Compressor System 2'],
  asset: ['Chiller 10', 'Chiller 20', 'Chiller 30', 'Cooling Tower A', 'Cooling Tower B', 'Primary Pump 1', 'Pump 3', 'Compressor 1', 'Compressor 2', 'Compressor 3'],
}

type GroupItem = { name: string; children?: string[] }

export const systemGroups: GroupItem[] = [
  { name: 'HVAC', children: ['Primary Cooling Water System', 'Secondary Cooling Water System', 'Cooling Water Condensor'] },
  { name: 'Compressors', children: ['Compressor System 1', 'Compressor System 2'] },
]

export const assetGroups: { name: string; children: { name: string; children: { name: string; children: string[] }[] }[] }[] = [
  { name: 'Nestle UAE', children: [
    { name: 'HVAC', children: [
      { name: 'Primary Cooling Water System', children: ['Chiller 10', 'Chiller 20', 'Chiller 30', 'Cooling Tower A', 'Cooling Tower B', 'Primary Pump 1'] },
      { name: 'Secondary Cooling Water System', children: ['Pump 3'] },
    ]},
    { name: 'Compressors', children: [
      { name: 'Compressor System 1', children: ['Compressor 1', 'Compressor 2'] },
      { name: 'Compressor System 2', children: ['Compressor 3'] },
    ]},
  ]},
]

