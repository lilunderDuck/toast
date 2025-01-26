import { InlineTool, BlockTool } from "@editorjs/editorjs"

/**Represent any editorjs's inline tool.
 * 
 * The `Partial<InlineTool>` part is a workaround for this error, I'm too lazy to fix
 * ```
 * Type 'typeof [something]' does not satisfy the constraint 'AnyEditorjsInlineToolClass'.
 *   Property 'render' is missing in type 'typeof [something]' but required in type 'InlineTool'.
 * ```
 * @see {@link InlineTool}
 */
type AnyEditorjsInlineToolClass = AnyClass & Partial<InlineTool>

/**This is a part of my type "hacking" here.
 * 
 * Basically it gets the editorjs's constructor argument type and *gets the first one*.
 * 
 * Every inline tool classes always has only one argument on its constructor,
 * that's why it *gets the first one*
 * @see {@link AnyEditorjsInlineToolClass}
 */
export type InlineToolContructorArgs<T extends AnyEditorjsInlineToolClass> = ConstructorParameters<T>[0]

export type BlockToolConstructorArgs<T extends AnyClass & Partial<BlockTool>> = ConstructorParameters<T>[0]

export type NoOptions = {}