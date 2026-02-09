import type { ChainedCommands } from "@tiptap/core"
import type { IconTypes } from "solid-icons"
import { BiRegularCodeCurly, BiSolidPlaylist } from "solid-icons/bi"
import { BsCameraVideoFill } from "solid-icons/bs"
import { FaSolidImage, FaSolidTable } from "solid-icons/fa"
import { RiDocumentTaskFill, RiMediaGalleryFill } from "solid-icons/ri"
// ...
import { getCommand } from "../utils"

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

export function getBlocksFloatingMenuOptions() {
  return [
    {
      type$: FloatingMenuType.LABEL,
      label$: "Text"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Code block",
      command$: getCommand('insertCodeBlock$'),
      icon$: BiRegularCodeCurly,
    },
    {
      type$: FloatingMenuType.LABEL,
      label$: "Media"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Image",
      command$: getCommand('insertImage$'),
      icon$: FaSolidImage
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Video",
      command$: getCommand('insertVideo$'),
      icon$: BsCameraVideoFill
    },
    {
      type$: FloatingMenuType.LABEL,
      label$: "Others"
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Table",
      command$: getCommand('insertTable$'),
      icon$: FaSolidTable
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Playlist",
      command$: getCommand('insertPlaylist$'),
      icon$: BiSolidPlaylist
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Gallery",
      command$: getCommand('insertGallery$'),
      icon$: RiMediaGalleryFill
    },
    {
      type$: FloatingMenuType.ITEM,
      name$: "Task",
      command$: getCommand('insertTask$'),
      icon$: RiDocumentTaskFill
    },
  ] as (IFloatingMenuItem | IFloatingMenuLabel | IFloatingMenuSeperator)[]
}