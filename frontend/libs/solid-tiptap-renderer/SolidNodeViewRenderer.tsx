import { Decoration, type NodeView as ProseMirrorNodeView } from "@tiptap/pm/view"
import { Node as ProseMirrorNode } from "@tiptap/pm/model"
import {
  type NodeViewRenderer,
  type NodeViewRendererOptions,
  type NodeViewRendererProps,
} from "@tiptap/core"
import { type Component } from "solid-js"
// ...
import { SolidEditor } from "./editor"
import { SolidNodeView } from "./internals/SolidNodeView"

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

export function SolidNodeViewRenderer(
  component: Component,
  options?: Partial<SolidNodeViewRendererOptions>
): NodeViewRenderer {
  return (props: NodeViewRendererProps) => {
    const { renderers$, setRenderers$ } = props.editor as SolidEditor

    if (!renderers$ || !setRenderers$) {
      console.log("Empty")
      return {} as ProseMirrorNodeView
    }

    return new SolidNodeView(
      component,
      props,
      options
    ) as unknown as ProseMirrorNodeView
  }
}