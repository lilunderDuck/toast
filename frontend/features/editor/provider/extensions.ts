import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import StarterKit from '@tiptap/starter-kit'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Placeholder from '@tiptap/extension-placeholder'
import { DetailsSummary, DetailsContent, Details } from '@tiptap/extension-details'
import { Color } from '@tiptap/extension-color'
import { CharacterCount } from '@tiptap/extensions'
import { common, createLowlight } from 'lowlight'
import { macro_mergeClassnames } from 'macro-def'
// ...
import { LocalEmbedExtension, TagExtension, GalleryExtension, ImageExtension } from "../extensions"
// ...
import __style from "./extensions.module.css"
import stylex from "@stylexjs/stylex"
import { PlaylistExtension } from '../extensions/playlist'
import { pluginEvent } from '~/plugins'

const style = stylex.create({
  ext__taskList: {
    listStyleType: "none",
    padding: 0
  },
  ext__taskItem: {
    display: "flex",
    gap: 10
  },
  ext__blockquote: {
    borderLeft: "2px solid var(--gray6)",
    paddingLeft: 15,
    paddingBlock: 10,
    fontStyle: "italic",
    color: "var(--gray11)"
  }
})

export function getExtensions() {
  const lowlight = createLowlight(common)

  const extensions = [
    StarterKit.configure({
      codeBlock: false,
      blockquote: {
        HTMLAttributes: stylex.attrs(style.ext__blockquote)
      }
    }),
    Subscript,
    Superscript,
    Highlight,
    Link,
    Underline,
    Table.configure({
      resizable: true
    }),
    Placeholder.configure({
      placeholder({ node }) {
        if (node.type.name === 'detailsSummary') {
          return 'Summary'
        }
        // console.log("hitting node", props.node.type)
        return "type something..."
      },
    }),
    TableCell,
    TableHeader,
    TableRow,
    TaskList.configure({
      HTMLAttributes: stylex.attrs(style.ext__taskList)
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: macro_mergeClassnames(stylex.attrs(style.ext__taskItem), __style.taskItem)
      }
    }),
    Color,
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "txt",
      exitOnArrowDown: false,
    }),
    DetailsSummary, 
    DetailsContent, 
    Details.configure({
      HTMLAttributes: {
        class: __style.details
      },
      openClassName: __style.detailsOpened
    }),
    // ------- misc functionality extension ------
    CharacterCount,
    // ------- custom extension zone -------
    TagExtension,
    LocalEmbedExtension,
    GalleryExtension,
    ImageExtension,
    PlaylistExtension
  ]

  pluginEvent.on$(PluginEvent.REGISTER_EDITOR_NODE, (nodeExtension) => {
    extensions.push(nodeExtension)
  })

  return extensions
}