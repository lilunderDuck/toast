import { type Accessor, createContext, useContext } from "solid-js"
import { type Node, type NodeViewProps, type NodeViewRendererProps } from "@tiptap/core"
import { Node as ProseMirrorNode } from "@tiptap/pm/model"
// ...
import { SolidEditor } from "./editor"

export type Attrs = Record<string, any>

export interface SolidNodeViewProps<A extends Attrs = Attrs> extends NodeViewProps {
  node: ProseMirrorNode & { 
    attrs: A 
  } /* override NodeViewProps.node */
  editor: SolidEditor /* override NodeViewProps.editor */
}

export interface SolidNodeViewContextProps<A extends Attrs = Attrs> extends NodeViewRendererProps {
  state$: Accessor<
    SolidNodeViewProps<A> & {
      onDragStart?(event: DragEvent): void
    }
  >
  updateAttribute$<T extends keyof A>(key: T, value: A[T]): void
  options$(): Node["options"],
  isSelected$(): boolean,
  attrs$(): A,
  delete$(): void
}

export type SolidNodeViewComponentProps = { state: SolidNodeViewProps }

export const SolidNodeViewContext = createContext<SolidNodeViewContextProps>()
/**A hook to access the state and attributes of a TipTap node within a `SolidNodeView`.
 * @example
 * ```tsx
 * import { Node } from '@tiptap/core'
 * 
 * type SampleNodeAttribute = {
 *   // define your node attribute here
 * }
 * 
 * export const SampleNode = Node.create({
 *   // ... node related stuff ...
 *   addNodeView: () => SolidNodeViewRenderer(() => {
 *     const { attrs$ } = useSolidNodeView<SampleNodeAttribute>()
 * 
 *     return (
 *       <NodeViewWrapper>
 *         Do something with the node state here
 *       </NodeViewWrapper>
 *     )
 *   }),
 * })
 * ```
 * @template Data The type of the node's attributes.
 * @returns An object containing accessors and functions to interact with the node's state.
 */
export function useSolidNodeView<A extends Attrs = Attrs>() {
  return useContext(SolidNodeViewContext) as SolidNodeViewContextProps<A>
}