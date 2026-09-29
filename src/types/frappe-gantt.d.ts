declare module 'frappe-gantt' {
  export type GanttTask = {
    id: string
    name: string
    start: string
    end: string
    progress?: number
    color?: string
    color_progress?: string
    custom_class?: string
    description?: string
  }

  export type GanttPopupContext = {
    task: GanttTask
    chart: Gantt
    get_title: () => HTMLElement
    set_title: (html: string) => void
    get_subtitle: () => HTMLElement
    set_subtitle: (html: string) => void
    get_details: () => HTMLElement
    set_details: (html: string) => void
    add_action: (
      html: string | ((task: GanttTask) => string),
      func: (task: GanttTask, chart: Gantt, e: MouseEvent) => void,
    ) => void
  }

  export type GanttOptions = {
    view_mode?: string
    view_mode_select?: boolean
    today_button?: boolean
    readonly?: boolean
    popup?: false | ((ctx: GanttPopupContext) => void | false | string)
    popup_on?: 'click' | 'hover'
    lines?: 'both' | 'horizontal' | 'vertical' | 'none'
    scroll_to?: 'today' | 'start' | 'end' | string | null
    bar_height?: number
    bar_corner_radius?: number
    padding?: number
    container_height?: number | 'auto'
    infinite_padding?: boolean
    holidays?: unknown
    arrow_markers?: boolean
    container_height_auto?: boolean
    on_view_change?: (mode: unknown) => void
  }

  export default class Gantt {
    constructor(element: string | Element, tasks: GanttTask[], options?: GanttOptions)
    $container: HTMLElement
    $svg: SVGSVGElement
    config: { column_width: number; header_height: number; view_mode: { name: string } }
    dates: Date[]
    layers: { grid: SVGGElement; bar: SVGGElement; arrow: SVGGElement; progress: SVGGElement }
    popup: { hide: () => void }
    show_popup: (opts: { x: number; y: number; task: GanttTask; target: Element }) => void
    change_view_mode(mode?: string, maintain_pos?: boolean): void
    clear(): void
    static VIEW_MODE: Record<string, unknown>
  }
}
