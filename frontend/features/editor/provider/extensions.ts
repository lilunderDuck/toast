import StarterKit from '@tiptap/starter-kit'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Placeholder from '@tiptap/extension-placeholder'
import { TextStyle, BackgroundColor, Color } from '@tiptap/extension-text-style'
import { CharacterCount } from '@tiptap/extensions'
import { MERGE_CLASS } from 'macro-def'
// ...
import { LocalEmbedExtension, TagExtension, GalleryExtension, ImageExtension, TableExtension, CodeBlockExtension, PlaylistExtension } from "../extensions"
// ...
import { pluginEvent } from '~/plugins'
// ...
import __style from "./extensions.module.css"
import stylex from "@stylexjs/stylex"

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
  const extensions = [
    StarterKit.configure({
      codeBlock: false,
      blockquote: {
        HTMLAttributes: stylex.attrs(style.ext__blockquote)
      },
      code: false
    }),
    Subscript,
    Superscript,
    Link,
    Underline,
    Placeholder.configure({
      placeholder({ node }) {
        if (node.type.name === 'detailsSummary') {
          return 'Summary'
        }
        // console.log("hitting node", props.node.type)
        return "type something..."
      },
    }),
    TaskList.configure({
      HTMLAttributes: stylex.attrs(style.ext__taskList)
    }),
    TaskItem.configure({
      HTMLAttributes: {
        class: MERGE_CLASS(stylex.attrs(style.ext__taskItem), __style.taskItem)
      }
    }),
    Color,
    TextStyle, 
    BackgroundColor,
    // DetailsSummary, 
    // DetailsContent, 
    // Details.configure({
    //   HTMLAttributes: {
    //     class: __style.details
    //   },
    //   openClassName: __style.detailsOpened
    // }),
    // ------- misc functionality extension ------
    CharacterCount,
    // ------- custom extension zone -------
    TagExtension,
    LocalEmbedExtension,
    GalleryExtension,
    ImageExtension,
    PlaylistExtension,
    TableExtension,
    CodeBlockExtension
  ]

  pluginEvent.on$(PluginEvent.REGISTER_EDITOR_NODE, (nodeExtension) => {
    extensions.push(nodeExtension)
  })

  return extensions
}