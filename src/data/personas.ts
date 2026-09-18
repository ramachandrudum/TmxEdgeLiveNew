export type PersonaType = 'internal' | 'external'
export type PersonaView = 'management' | 'buhead' | 'operator'

export type Persona = {
  type: PersonaType
  view: PersonaView
}

export const personaKey = (p: Persona): string => `${p.type}:${p.view}`

export const personaNav: Record<string, string[]> = {
  'internal:management': ['home', 'dashboard', 'incidents', 'tasks', 'report'],
  'internal:buhead': ['home', 'dashboard', 'incidents', 'tasks', 'report'],
  'internal:operator': ['home', 'dashboard', 'incidents', 'tasks', 'report'],
  'external:management': ['home', 'dashboard', 'incidents', 'tasks', 'report'],
  'external:operator': ['home', 'dashboard', 'incidents', 'tasks', 'report'],
}