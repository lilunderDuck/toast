import type { ChainedCommands, Command } from "@tiptap/core"
import type { IconTypes } from "solid-icons"
import { BiRegularCodeCurly, BiSolidPlaylist } from "solid-icons/bi"
import { BsCameraVideoFill } from "solid-icons/bs"
import { FaSolidImage, FaSolidTable } from "solid-icons/fa"
import { RiMediaGalleryFill } from "solid-icons/ri"
// ...
import type { SolidEditor } from "~/libs/solid-tiptap-renderer"

export interface IFloatingMenuItem {
  type$: FloatingMenuType.ITEM
  name$: string
  icon$: IconTypes
  command$: () => ChainedCommands
}

export interface IFloatingMenuLabel {
  type$: FloatingMenuType.LABEL
  label$: string
}

export interface IFloatingMenuSeperator {
  type$: FloatingMenuType.SEPERATOR
}

export function getBlocksFloatingMenuOptions(editorInstance: () => SolidEditor) {
  const chainCommand = () => editorInstance().chain().focus()

  return [
    {
      type$: FloatingMenuType.LABEL,
      label$: "Text"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Code block",
      command$: () => chainCommand().insertCodeBlock$(),
      icon$: BiRegularCodeCurly,
    },
    {
      type$: FloatingMenuType.LABEL,
      label$: "Media"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Image",
      command$: () => chainCommand().insertImage$(),
      icon$: FaSolidImage
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Video",
      command$: () => chainCommand().insertVideo$(),
      icon$: BsCameraVideoFill
    },
    {
      type$: FloatingMenuType.LABEL,
      label$: "Others"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Table",
      command$: () => chainCommand().insertTable$(),
      icon$: FaSolidTable
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Playlist",
      command$: () => chainCommand().insertPlaylist$(),
      icon$: BiSolidPlaylist
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Gallery",
      command$: () => chainCommand().insertGallery$(),
      icon$: RiMediaGalleryFill
    },
  ] as (IFloatingMenuItem | IFloatingMenuLabel | IFloatingMenuSeperator)[]
}