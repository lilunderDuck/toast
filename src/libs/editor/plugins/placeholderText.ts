import stylex from "@stylexjs/stylex"
import Placeholder from "@tiptap/extension-placeholder"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  placeholderText: {
    "::before": {
      color: 'var(--gray10)',
      content: 'attr(data-placeholder)',
      float: 'left',
      height: 0,
      pointerEvents: 'none',
    }
  }
})

/**Absolutely hard-coded the placeholder text based on the node type of it.
 * The placeholder text could not be randomized because... tiptap fired many update.
 * 
 * If you/myself want to add a new placeholder based on some node type,
 * it's pretty simple, first, uncomment this part here
 * ```
 * // console.log(nodeType) // <--- here
 * ```
 * 
 * ... then watch the console, finaly add a new one
 * ```
 * switch(nodeType) {
 *   ...
 *   case 'something':
 *     return 'new placeholder text'
 * }
 * ```
 * @param nodeType
 * @returns a placeholder text based on `nodeType`
 */
function getPlaceholderText(nodeType: string) {
  // uncomment this if I have no idea what is the exact value of nodeType is
  // console.log(nodeType)
  switch (nodeType) {
    case 'heading':
      return '<- Something that can catch your little eyes'
    case 'orderedList':
    case 'bulletList':
      return 'So, what should be in here, hm?'
    case 'codeBlock':
      return 'Insert a little piece of code in here'
    case 'blockquote':
      return 'A blockquote to quote other quotes. Hmm, this is confusing already'
    case 'taskList':
      return 'A classic checkbox that act like a "todo list"'
    default:
      return 'Type something (your thought, a little secret, a note, anything)'
  }
}

/**Configured `tiptap`'s placeholder extension with custom placeholder text and styling.
 * @see https://tiptap.dev/docs/editor/extensions/functionality/placeholder
 */
export const PlaceholderText = Placeholder.configure({
  placeholder: ({ node }) => getPlaceholderText(node.type.name),
  emptyNodeClass: mergeClassname(stylex.attrs(style.placeholderText)),
})