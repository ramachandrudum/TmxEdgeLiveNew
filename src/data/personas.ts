export type PersonaType = 'internal' | 'external'
export type PersonaView = 'management' | 'buhead' | 'operator'

export type Persona = {
  type: PersonaType
  view: PersonaView
}

export const personaKey = (p: Persona): string => `${p.type}:${p.view}`

export const personaNav: Record<string, string[]> = {
  'internal:management': ['home', 'dashboard', 'incidents', 'maintenance', 'checklist', 'tasks', 'tags'],
  'internal:buhead': ['home', 'dashboard', 'incidents', 'checklist', 'tags'],
  'internal:operator': ['home', 'dashboard', 'incidents', 'maintenance', 'checklist', 'tasks'],
  'external:management': ['home', 'dashboard', 'tasks', 'tags'],
  'external:operator': ['home', 'dashboard', 'incidents', 'checklist'],
}