import { Node, type Attribute, type NodeConfig } from "@tiptap/core"
import { Transaction } from "prosemirror-state"
import type { IconTypes } from "solid-icons"
import type { VoidComponent } from "solid-js"
import { SolidNodeViewRenderer, type SolidEditor } from "~/libs/solid-tiptap-renderer"

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
 * export const SampleNode = createEditorNode({
 *   name: "sampleNode",
 *   // ... node related stuff ...
 *   commands$() {
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
 * @see {@link createEditorNode}
 */
export function insertNodeAtCurrentPosition<T extends {}>(
  theThisType: ThisInAddCommands | ThisInInputRules,
  tr: Transaction,
  data: T
): true {
  console.assert(
    theThisType, 
    [
      "The \"this\" type is undefined.",
      "",
      "If your extension code currently looks something like this:",
      "1   | export const NodeExtension = createEditorNode<...>(..., {",
      "2   |   commands$: () => {",
      "3   |     return {",
      "4   |       someCommand$: () => ({ tr }) => {",
      "5   |         return insertNodeAtCurrentPosition<...>(this, tr, ...)",
      "    |                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
      "6   |       },",
      "7   |     }",
      "8   |   }",
      "9   | })",
      "",
      "Please update to this:",
      "2   |   commands$() {",
      "    |   ^^^^^^^^^^^^^",
      "3   |     return {",
      "... |        ...",
      "7   |     }",
      "8   |   }",
      "",
      "Also noted that your editor will give you an error at this line, the same fix can be applied:",
      "5   |   return insertNodeAtCurrentPosition<...>(this, tr, ...)",
      "    |                                           ^^^^",
      "    |    Argument of type 'undefined' is not assignable to parameter of type '[... A lot of stuff ...]' .ts(2345)",
      "",
      "Using arrow function in \"commands$\" property can break your extension.",
    ].join('\n')
  )

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
  attributes$(): Record<keyof T, Pick<Attribute, "default" | "isRequired">>
  View$: VoidComponent
}

export interface IEditorMenuOptions {
  name$: string
  icon$: IconTypes
  run$: AnyNoArgsFunction
}

interface IEditorInlineNodeOptions<
T extends Record<string, any>
> extends IBaseEditorNodeOptions<T> {
  inputRules$?: NodeConfig["addInputRules"]
}

interface IEditorBlockNodeOptions<
T extends Record<string, any>
> extends IBaseEditorNodeOptions<T> {
  commands$: NodeConfig<T, any>["addCommands"]
  menu$: (editorInstance: () => SolidEditor) => IEditorMenuOptions
}

interface IEditorNodeOptionsMap<
  T extends Record<string, any>
> {
  [EditorNodeType.BLOCK]: IEditorBlockNodeOptions<T>
  [EditorNodeType.INLINE]: IEditorInlineNodeOptions<T>
}

export function createEditorNode<
  Attrs extends Record<string, any>,
  // Weird confusing generic
  NodeType extends EditorNodeType,
>(
  type: NodeType, 
  options: IEditorNodeOptionsMap<Attrs>[NodeType]
) {
  const NODE_OPTIONS_MAPPING: Record<EditorNodeType, Partial<NodeConfig>> = {
    [EditorNodeType.BLOCK]: {
      group: 'block',
      inline: false,
      addCommands: (options as IEditorBlockNodeOptions<Attrs>).commands$,
    },
    [EditorNodeType.INLINE]: {
      group: 'inline',
      content: 'inline*',
      inline: true,
      addInputRules: (options as IEditorInlineNodeOptions<Attrs>).inputRules$
    }
  }

  const nodeConfig: NodeConfig = {
    ...NODE_OPTIONS_MAPPING[type],
    name: options.name$,
    selectable: false,
    atom: true,
    addAttributes: options.attributes$,
    addNodeView: () => SolidNodeViewRenderer(options.View$),
  }

  return Node.create(nodeConfig)
}