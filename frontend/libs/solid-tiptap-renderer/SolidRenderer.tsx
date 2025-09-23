import { type Accessor, type Component, createSignal, type Setter } from "solid-js"
import { SolidEditor } from "./editor"
import type { Attrs, SolidNodeViewProps } from "./useSolidNodeView"

export interface SolidRendererOptions<S = SolidNodeViewProps> {
  editor$: SolidEditor
  state$: S
  as$?: string
}

export class SolidRenderer<S = SolidNodeViewProps> {
  public declare state$: Accessor<S>
  public declare setState$: Setter<S>
  public declare element$: Element
  public declare component$: Component<{ state: S }>
  private declare editor$: SolidEditor
  public id$ = crypto.randomUUID()

  public constructor(
    component: Component<{ state: S }>,
    options: SolidRendererOptions<S>
  ) {
    const [state, setState] = createSignal<S>(options.state$)
    const element = document.createElement(as)
    element.setAttribute("data-solid-renderer", "")
    
    this.setState$ = setState
    this.state$ = state
    this.element$ = element
    this.component$ = component
    this.editor$ = options.editor$
    this.editor$.setRenderers$([
      ...this.editor$.renderers$(),
      this as unknown as SolidRenderer<SolidNodeViewProps<Attrs>>,
    ])
  }

  public destroy(): void {
    this.editor$.setRenderers$((renderers) => {
      return renderers.filter((renderer) => renderer.id$ !== this.id$)
    })
  }
}