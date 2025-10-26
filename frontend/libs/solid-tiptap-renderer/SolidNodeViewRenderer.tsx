import { Decoration, type NodeView as ProseMirrorNodeView } from "@tiptap/pm/view"
import {
  type DecorationWithType,
  NodeView,
  type NodeViewRenderer,
  type NodeViewRendererOptions,
  type NodeViewRendererProps,
} from "@tiptap/core"
import { type Component, createMemo } from "solid-js"
import { Dynamic } from "solid-js/web"
import { Node as ProseMirrorNode } from "@tiptap/pm/model"
// ...
import {
  SolidNodeViewContext,
  type SolidNodeViewProps,
} from "./useSolidNodeView"
import { SolidEditor } from "./editor"
import { SolidRenderer } from "./SolidRenderer"

export interface SolidNodeViewRendererOptions extends NodeViewRendererOptions {
  setSelection:
    | ((anchor: number, head: number, root: Document | ShadowRoot) => void)
    | null
  update:
    | ((props: {
        oldNode: ProseMirrorNode
        oldDecorations: Decoration[]
        newNode: ProseMirrorNode
        newDecorations: Decoration[]
        updateProps: () => void
      }) => boolean)
    | null
}

class SolidNodeView extends NodeView<
  Component,
  SolidEditor,
  SolidNodeViewRendererOptions
> {
  constructor(component: Component, protected props: NodeViewRendererProps, options?: Partial<SolidNodeViewRendererOptions>) {
    super(component, props, options)
  }

  public declare contentDOMElement$: HTMLElement | null
  public declare renderer$: SolidRenderer
  public get dom(): HTMLElement {
    return this.renderer$.element$ as HTMLElement
  }

  public get contentDOM(): HTMLElement | null {
    if (this.node.isLeaf) {
      return null
    }

    this.maybeMoveContentDOM$()

    return this.contentDOMElement$
  }

  public mount(): void {
    const state: SolidNodeViewProps = {
      editor$: this.editor,
      node$: this.node,
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
    }

    const SolidNodeViewProvider: Component<{ state: SolidNodeViewProps }> = (
      props
    ) => {
      const component = createMemo(() => this.component)
      const context = {
        state: createMemo(() => ({
          onDragStart: this.onDragStart.bind(this),
          ...props.state,
        })),
        props: this.props
      }

      return (
        <SolidNodeViewContext.Provider value={context}>
          <Dynamic component={component()} />
        </SolidNodeViewContext.Provider>
      )
    }

    const elementToRender = this.node.isInline ? "span" : "div"

    if (this.node.isLeaf) {
      this.contentDOMElement$ = null
    } else {
      // const element = document.createElement(elementToRender)
      // element.style.whiteSpace = "inherit"
      // this.contentDOMElement$ = element
      this.contentDOMElement$ = document.createElement(elementToRender)
    }

    this.renderer$ = new SolidRenderer(SolidNodeViewProvider, {
      editor$: this.editor,
      state$: state,
      as$: elementToRender,
    })

    this.renderer$.element$.setAttribute("data-node-type", this.node.isInline ? "node-inline" : "node-block")
  }

  public maybeMoveContentDOM$(): void {
    const contentElement = this.dom.querySelector("[data-node-view-content]")

    if (
      this.contentDOMElement$ &&
      contentElement &&
      !contentElement.contains(this.contentDOMElement$)
    ) {
      contentElement.append(this.contentDOMElement$)
    }
  }

  public update(
    node: ProseMirrorNode,
    decorations: DecorationWithType[]
  ): boolean {
    if (node.type !== this.node.type) {
      return false
    }

    if (typeof this.options.update === "function") {
      const oldNode = this.node
      const oldDecorations = this.decorations

      this.node = node
      this.decorations = decorations

      return this.options.update({
        oldNode,
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        updateProps: () => this.updateProps({ node, decorations }),
      })
    }

    if (node === this.node && this.decorations === decorations) {
      return true
    }

    this.node = node
    this.decorations = decorations
    this.updateProps({ node, decorations })

    return true
  }

  public setSelection(
    anchor: number,
    head: number,
    root: Document | ShadowRoot
  ): void {
    this.options.setSelection?.(anchor, head, root)
  }

  public selectNode(): void {
    this.renderer$.setState$?.((state) => ({ ...state, selected: true }))
  }

  public deselectNode(): void {
    this.renderer$.setState$?.((state) => ({ ...state, selected: false }))
  }

  public destroy(): void {
    this.renderer$.destroy()
    this.contentDOMElement$ = null
  }

  private updateProps(props: Partial<SolidNodeViewProps>): void {
    this.renderer$.setState$?.((state) => ({ ...state, ...props }))
    this.maybeMoveContentDOM$()
  }
}

export function SolidNodeViewRenderer(
  component: Component,
  options?: Partial<SolidNodeViewRendererOptions>
): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    const { renderers$, setRenderers$ } = props.editor as SolidEditor

    if (!renderers$ || !setRenderers$) {
      return {}
    }

    return new SolidNodeView(
      component,
      props,
      options
    ) as unknown as ProseMirrorNodeView
  }
}