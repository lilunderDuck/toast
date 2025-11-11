import { type Attribute, type Command, type NodeConfig } from "@tiptap/core"
import { Transaction } from "prosemirror-state"
import type { IconTypes } from "solid-icons"
import type { VoidComponent } from "solid-js"
import { type SolidEditor } from "~/libs/solid-tiptap-renderer"

/**Extracts the `this` type from a `NodeConfig`'s `addCommands` method.  */
export type ThisInAddCommands = ThisParameterType<NonNullable<NodeConfig["addCommands"]>>
/**Extracts the `this` type from a `NodeConfig`'s `addInputRules` method. **/
export type ThisInInputRules = ThisParameterType<NonNullable<NodeConfig["addInputRules"]>>

/**Inserts a new Tiptap node at the current selection or cursor position within a `ProseMirror` transaction.
 * @example
 * ```tsx
 * import { Node } from '@tiptap/core'
 * 
 * type SampleNodeAttribute = {
 *   // define your node attribute here
 * }
 * 
 * // you can add this to make typescript happy.
 * declare module '@tiptap/core' {
 *   interface Commands<ReturnType> {
 *     sampleNode: {
 *       insertSampleNode: () => ReturnType
 *     }
 *   }
 * }
 * 
 * export const SampleNode = Node.create({
 *   name: "sampleNode",
 *   // ... node related stuff ...
 *   addCommands() {
 *     return {
 *       insertSampleNode: () => ({ tr }) => {
 *         return insertNodeAtCurrentPosition<SampleNodeAttribute>(this, tr, {
 *           // your defined node attribute
 *         })
 *       },
 *     }
 *   },
 *   // the same applied with addInputRules, you can take a look at the tag extension.
 * })
 * ```
 * @template T The type of the data object to be used as attributes for the new node.
 * @param theThisType The `this` type provided by Tiptap's extension methods.
 * @param tr The current ProseMirror transaction.
 * @param data The attributes to be applied to the newly created node.
 * @returns Always returns `true` to signal that the command was successfully executed.
 */
export function insertNodeAtCurrentPosition<T extends {}>(
  theThisType: ThisInAddCommands | ThisInInputRules,
  tr: Transaction,
  data: T
): true {
  const { $from, $to } = tr.selection
  // here we use tr.mapping.map to map the position between transaction steps
  const from = tr.mapping.map($from.pos)
  const to = tr.mapping.map($to.pos)
  const node = theThisType.type.create(data)
  tr.replaceRangeWith(from, to, node)
  return true
}

interface IBaseEditorNodeOptions<T extends Record<string, any>> {
  name$: string
  commands$: Record<string, () => Command>
  attributes$(): Record<keyof T, Pick<Attribute, "default" | "isRequired">>
  View$: VoidComponent
  menu$: (editorInstance: () => SolidEditor) => IEditorMenuOptions
}

export interface IEditorMenuOptions {
  name$: string
  icon$: IconTypes
  run$: AnyNoArgsFunction
}

interface IEditorInlineNodeOptions<
  T extends Record<string, any>
> extends IBaseEditorNodeOptions<T> {
  inputRules: NodeConfig["addInputRules"]
}

interface IEditorBlockNodeOptions<
  T extends Record<string, any>
> extends IBaseEditorNodeOptions<T> {
  // ...
}

interface IEditorNodeOptionsMap<
  T extends Record<string, any>
> {
  [EditorNodeType.BLOCK]: IEditorBlockNodeOptions<T>
  [EditorNodeType.INLINE]: IEditorInlineNodeOptions<T>
}

export function createEditorNode<
  U extends Record<string, any>,
  T extends EditorNodeType,
>(type: T, options: IEditorNodeOptionsMap<U>[T]) {
  // TODO
}