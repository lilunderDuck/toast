import type { ChainedCommands, Command } from "@tiptap/core"
import type { IconTypes } from "solid-icons"
import { BiRegularCodeCurly, BiSolidPlaylist } from "solid-icons/bi"
import { BsCameraVideoFill } from "solid-icons/bs"
import { FaSolidImage, FaSolidTable } from "solid-icons/fa"
import { RiMediaGalleryFill } from "solid-icons/ri"
// ...
import type { SolidEditor } from "~/libs/solid-tiptap-renderer"

export interface IFloatingMenuItem {
  name$: string
  icon$: IconTypes
  command$: () => ChainedCommands
}

export function getBlocksFloatingMenuOptions(editorInstance: () => SolidEditor) {
  const chainCommand = () => editorInstance().chain().focus()

  return [
    {
      name$: "Code block",
      command$: () => chainCommand().insertCodeBlock$(),
      icon$: BiRegularCodeCurly,
    },
    {
      name$: "Image",
      command$: () => chainCommand().insertImage$(),
      icon$: FaSolidImage
    },
    {
      name$: "Video",
      command$: () => chainCommand().insertVideo$(),
      icon$: BsCameraVideoFill
    },
    FLOATING_MENU_SEPERATOR,
    {
      name$: "Table",
      command$: () => chainCommand().insertTable$(),
      icon$: FaSolidTable
    },
    {
      name$: "Playlist",
      command$: () => chainCommand().insertPlaylist$(),
      icon$: BiSolidPlaylist
    },
    {
      name$: "Gallery",
      command$: () => chainCommand().insertGallery$(),
      icon$: RiMediaGalleryFill
    },
    FLOATING_MENU_SEPERATOR,
  ] as (IFloatingMenuItem | typeof FLOATING_MENU_SEPERATOR)[]
}