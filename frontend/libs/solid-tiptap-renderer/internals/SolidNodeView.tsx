import { NodeView, type DecorationWithType, type NodeViewRendererProps } from "@tiptap/core"
import { Node as ProseMirrorNode } from "@tiptap/pm/model"
import { Dynamic } from "solid-js/web"
import { createMemo, type Component } from "solid-js"
// ...
import type { SolidEditor } from "../editor"
import type { SolidNodeViewRendererOptions } from "../SolidNodeViewRenderer"
import { SolidRenderer } from "./SolidRenderer"
import { SolidNodeViewContext, type SolidNodeViewComponentProps, type SolidNodeViewProps } from "../useSolidNodeView"

// FIXME: Move to somewhere else
export const META_ALLOW_INTENTIONAL_DELETION = "0"

export class SolidNodeView extends NodeView<
  Component,
  SolidEditor,
  SolidNodeViewRendererOptions
> {
  constructor(
    public component: Component,
    protected props$: NodeViewRendererProps,
    options?: Partial<SolidNodeViewRendererOptions>
  ) {
    super(component, props$, options)
  }

  public declare contentDOMElement$: HTMLElement | null
  public declare renderer$: SolidRenderer
  public override get dom(): HTMLElement {
    return this.renderer$.element$ as HTMLElement
  }

  public override get contentDOM(): HTMLElement | null {
    if (this.node.isLeaf) {
      return null
    }

    this.maybeMoveContentDOM$()

    return this.contentDOMElement$
  }

  public override mount(): void {
    const state: SolidNodeViewProps = {
      editor: this.editor,
      node: this.node,
      // @ts-ignore - it should work fine
      decorations: this.decorations,
      selected: false,
      extension: this.extension,
      getPos: () => this.getPos(),
      updateAttributes: (attributes = {}) => this.updateAttributes(attributes),
      deleteNode: () => this.deleteNode(),
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

    const SolidNodeViewProvider = (props: SolidNodeViewComponentProps) => {
      const component = createMemo(() => this.component)
      const nodeState = createMemo(() => ({
        onDragStart: this.onDragStart.bind(this),
        ...props.state,
      }))

      const updateAttribute = (key: string, value: any) => {
        nodeState().updateAttributes({ [key]: value })
      }

      const options = () => nodeState().extension.options
      const selected = () => {
        return nodeState().selected
      }

      const deleteCurrentNode = () => {
        const { getPos, node, editor } = nodeState()
        const pos = getPos()
        if (pos == undefined && pos == -1) {
          console.error("Could not get node position for deletion.")
          return
        }

        // Create the transaction to delete the node
        const tr = editor.state.tr.delete(pos, pos + node.nodeSize)
        // IMPORTANT: Add a meta property to signal this transaction is allowed
        tr.setMeta(META_ALLOW_INTENTIONAL_DELETION, true) // Custom flag for our plugin
        editor.view.dispatch(tr)
        console.log("Direct node deletion initiated by button. Plugin should allow this.")
      }

      return (
        <SolidNodeViewContext.Provider value={{
          state$: nodeState,
          // props: this.props$,
          updateAttribute$: updateAttribute,
          options$: options,
          isSelected$: selected,
          attrs$: () => {
            console.log(nodeState())
            return nodeState().node.attrs
          },
          delete$: deleteCurrentNode
        }}>
          <Dynamic component={component()} />
        </SolidNodeViewContext.Provider>
      )
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

  // implement: ProseMirrorNodeView.update
  public update(node: ProseMirrorNode, decorations: DecorationWithType[]) {
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
        // @ts-ignore - readonly prop, let's break the rule
        oldDecorations,
        newNode: node,
        newDecorations: decorations,
        updateProps: () => updateNodeProps(this, { node, decorations }),
      })
    }

    if (node === this.node && this.decorations === decorations) {
      return true
    }

    this.node = node
    this.decorations = decorations
    updateNodeProps(this, { node, decorations })

    return true
  }

  // implement: ProseMirrorNodeView.setSelection
  public setSelection(
    anchor: number,
    head: number,
    root: Document | ShadowRoot
  ): void {
    this.options.setSelection?.(anchor, head, root)
  }

  // implement: ProseMirrorNodeView.selectNode
  public selectNode(): void {
    this.renderer$.setState$?.((state) => ({ ...state, selected: true }))
  }

  // implement: ProseMirrorNodeView.deselectNode
  public deselectNode(): void {
    this.renderer$.setState$?.((state) => ({ ...state, selected: false }))
  }

  // implement: ProseMirrorNodeView.destroy
  public destroy(): void {
    this.renderer$.destroy()
    this.contentDOMElement$ = null
  }
}

function updateNodeProps(thisRef: SolidNodeView, props: Partial<SolidNodeViewProps>) {
  thisRef.renderer$.setState$?.((state) => ({ ...state, ...props }))
  thisRef.maybeMoveContentDOM$()
}