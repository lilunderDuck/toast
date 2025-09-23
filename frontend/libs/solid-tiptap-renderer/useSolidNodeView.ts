import { SolidEditor } from "./editor"
import { type Accessor, type Context, createContext, useContext } from "solid-js"
import { type NodeViewProps, type NodeViewRendererProps } from "@tiptap/core"
import { Node as ProseMirrorNode } from "@tiptap/pm/model"

export type Attrs = Record<string, any>

export interface SolidNodeViewProps<A extends Attrs = Attrs> extends NodeViewProps {
  node$: ProseMirrorNode & { attrs: A }
  editor$: SolidEditor
}

export interface SolidNodeViewContextProps<A extends Attrs = Attrs> extends NodeViewRendererProps {
  state: Accessor<
    SolidNodeViewProps<A> & {
      onDragStart?(event: DragEvent): void
    }
  >
}

export const SolidNodeViewContext = createContext()
export function useSolidNodeView<A extends Attrs = Attrs>() {
  return useContext(SolidNodeViewContext as Context<SolidNodeViewContextProps<A>>)
}