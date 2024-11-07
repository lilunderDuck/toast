import StarterKit from '@tiptap/starter-kit'
import Mention from "@tiptap/extension-mention"
import CharacterCount from "@tiptap/extension-character-count"
import Link from '@tiptap/extension-link'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Image from '@tiptap/extension-image'
import BubbleMenu from "@tiptap/extension-bubble-menu"
import FloatingMenu from "@tiptap/extension-floating-menu"
import { Editor, EditorOptions } from '@tiptap/core'
// ...
import __style from './BlockStyles.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { mergeClassname } from '~/utils'
// ...
import { 
  CodeBlockPrism,
  PlaceholderText, 
  TableRelated, 
  Task 
} from '../plugins'

const style = stylex.create({
  codeBlock: {
    backgroundColor: 'var(--gray3)',
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    fontSize: 14,
    whiteSpace: 'break-spaces',
    wordBreak: 'break-all'
  }
})

export type OnEditorUpdate = EditorOptions['onUpdate']

export const createEditor = (
  whereToPut: HTMLElement,
  bubbleMenuElement: HTMLDivElement,
  floatingMenuElement: HTMLDivElement,
  isEditable: boolean,
  onUpdate: OnEditorUpdate
) => new Editor({
  extensions: [
    StarterKit.configure({
      codeBlock: false,
    }),
    // ...
    Image,
    CodeBlockPrism.configure({
      exitOnArrowDown: true,
      defaultLanguage: 'plaintext',
      HTMLAttributes: {
        class: mergeClassname(
          stylex.attrs(style.codeBlock), 
          __style['code-block']
        ),
        spellcheck: false
      }
    }),
    Mention,
    PlaceholderText,
    CharacterCount,
    Link.configure({
      protocols: ['https']
    }),
    Subscript,
    Superscript,
    BubbleMenu.configure({
      element: bubbleMenuElement,
      tippyOptions: {
        appendTo: document.body
      }
    }),
    FloatingMenu.configure({
      element: floatingMenuElement,
      tippyOptions: {
        appendTo: document.body
      }
    }),
    ...Task,
    ...TableRelated
  ],
  onUpdate,
  editable: isEditable,
  element: whereToPut
  // ...
})