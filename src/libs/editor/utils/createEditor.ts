import StarterKit from '@tiptap/starter-kit'
import Mention from "@tiptap/extension-mention"
import CharacterCount from "@tiptap/extension-character-count"
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
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
import { CodeBlockPrism, PlaceholderText } from '../plugins'

const style = stylex.create({
  codeBlock: {
    backgroundColor: 'var(--gray3)',
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    fontSize: 14,
    whiteSpace: 'break-spaces',
    wordBreak: 'break-all'
  },
  table: {
    borderCollapse: 'collapse',
    margin: 0,
    overflow: 'hidden',
    tableLayout: 'fixed',
    width: '100%',
  },
  tableHeader: {
    border: '1px solid var(--gray5)',
    // box-sizing: 'border-box',
    minWidth: '1em',
    padding: '6px 8px',
    position: 'relative',
    verticalAlign: 'top',
    backgroundColor: 'var(--gray3)',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  tableCell: {
    border: '1px solid var(--gray4)',
    padding: '6px 8px',
  }
  // paragraph: {
  //   marginBottom: 15
  // }
})

export type OnEditorUpdate = EditorOptions['onUpdate']

const starterKit = StarterKit.configure({
  codeBlock: false,
  // paragraph: {
  //   HTMLAttributes: stylex.attrs(style.paragraph)
  // }
  
})

export const createEditor = (
  whereToPut: HTMLElement,
  bubbleMenuElement: HTMLDivElement,
  floatingMenuElement: HTMLDivElement,
  isEditable: boolean,
  onUpdate: OnEditorUpdate
) => new Editor({
  extensions: [
    starterKit,
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
    TaskItem.configure({
      HTMLAttributes: {
        class: __style.taskItem
      }
    }),
    TaskList.configure({
      HTMLAttributes: {
        class: __style.taskList
      }
    }),
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
    Table.configure({
      resizable: true,
      HTMLAttributes: stylex.attrs(style.table)
    }),
    TableRow,
    TableHeader.configure({
      HTMLAttributes: stylex.attrs(style.tableHeader)
    }),
    TableCell.configure({
      HTMLAttributes: stylex.attrs(style.tableCell)
    }),
  ],
  onUpdate,
  editable: isEditable,
  element: whereToPut
  // ...
})