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

function getPlaceholderText(nodeType: string) {
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

export const PlaceholderText = Placeholder.configure({
  placeholder: ({ node }) => getPlaceholderText(node.type.name),
  emptyNodeClass: mergeClassname(stylex.attrs(style.placeholderText)),
})