import { BsArchiveFill, BsBlockquoteLeft, BsCheck2Square, BsImageFill, BsInfoCircleFill, BsSubscript, BsSuperscript, BsTable, BsTypeBold, BsTypeItalic, BsTypeStrikethrough, BsTypeUnderline, BsWindowSplit } from "solid-icons/bs"
import { RiEditorH1, RiEditorH2, RiEditorH3, RiEditorH4, RiEditorH5, RiEditorH6 } from "solid-icons/ri"
import type { IEditorContext } from "./EditorProvider"
import { TbPlaylist } from "solid-icons/tb"

export function createEditorMenuManager(editor: IEditorContext["editor$"]) {
  const chainCommand = () => editor().chain().focus()
  const toggleHeading = (level: 1 | 2 | 3 | 4 | 5 | 6) => chainCommand().toggleHeading({
    level: level
  }).run()
  
  const floatingMenuOptions = [
    {
      name$: "image",
      icon$: BsImageFill,
      run$: () => chainCommand().insertImage$().run()
    },
    {
      name$: "table",
      icon$: BsTable,
      run$: () => chainCommand().insertTable().run()
    },
    {
      name$: "gallery",
      icon$: BsArchiveFill,
      run$: () => chainCommand().insertGallery$().run()
    },
    {
      name$: "local embed",
      icon$: BsWindowSplit,
      run$: () => chainCommand().insertLocalEmbed$().run()
    },
    {
      name$: "details",
      icon$: BsInfoCircleFill,
      // @ts-ignore
      run$: () => chainCommand().setDetails().run()
    },
    {
      name$: "todo",
      icon$: BsCheck2Square,
      run$: () => chainCommand().toggleTaskList().run()
    },
    {
      name$: "blockquote",
      icon$: BsBlockquoteLeft,
      run$: () => chainCommand().toggleBlockquote().run()
    },
    {
      name$: "playlist",
      icon$: TbPlaylist,
      run$: () => chainCommand().insertPlaylist$().run()
    }
  ]

  const menuOptions = [
    { name$: "bold", icon$: BsTypeBold, run$: () => chainCommand().toggleBold().run() },
    { name$: "italic", icon$: BsTypeItalic, run$: () => chainCommand().toggleItalic().run() },
    { name$: "strikethrough", icon$: BsTypeStrikethrough, run$: () => chainCommand().toggleStrike().run() },
    { name$: "blockquote", icon$: BsBlockquoteLeft, run$: () => chainCommand().toggleBlockquote().run() },
    { name$: "heading 1", icon$: RiEditorH1, run$: () => toggleHeading(1) },
    { name$: "heading 2", icon$: RiEditorH2, run$: () => toggleHeading(2) },
    { name$: "heading 3", icon$: RiEditorH3, run$: () => toggleHeading(3) },
    { name$: "heading 4", icon$: RiEditorH4, run$: () => toggleHeading(4) },
    { name$: "heading 5", icon$: RiEditorH5, run$: () => toggleHeading(5) },
    { name$: "heading 6", icon$: RiEditorH6, run$: () => toggleHeading(6) },
    { name$: "subscript", icon$: BsSubscript, run$: () => chainCommand().toggleSubscript().run() },
    { name$: "superscript", icon$: BsSuperscript, run$: () => chainCommand().toggleSuperscript().run() },
    { name$: "underline", icon$: BsTypeUnderline, run$: () => chainCommand().toggleUnderline().run() },
  ]

  return {
    floatingMenuOptions$: () => floatingMenuOptions,
    menuOptions$: () => menuOptions
  }
}