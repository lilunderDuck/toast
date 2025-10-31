import type { IconTypes } from "solid-icons"
import { BsArchiveFill, BsCheck2Square, BsImageFill, BsInfoCircleFill, BsTable, BsWindowSplit } from "solid-icons/bs"
import { TbPlaylist } from "solid-icons/tb"
import type { Command } from "@tiptap/core"
import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Divider } from "~/components"
import { useEditorContext } from "~/features/editor/provider"
// ...
import { MenuItem } from "./MenuItem"

export interface ISlashCommandMenuItem {
  name$: string
  icon$: IconTypes
  command$: () => Command
}

const style = stylex.create({
  menu: {
    width: "14.5rem",
    fontSize: 14,
    backgroundColor: "var(--gray3)",
    borderRadius: 6
  }
})

interface ISlashCommandMenProps {
  ref: Ref<"div">
}

export function SlashCommandMenu(props: ISlashCommandMenProps) {
  const { editor$ } = useEditorContext()

  const chainCommand = () => editor$().chain().focus()

  const mediaBasedMenuItems = (): ISlashCommandMenuItem[] => [
    {
      name$: "Image",
      icon$: BsImageFill,
      command$: () => chainCommand().insertImage$()
    },
    {
      name$: "Playlist",
      icon$: TbPlaylist,
      command$: () => chainCommand().insertPlaylist$()
    },
    {
      name$: "Gallery",
      icon$: BsArchiveFill,
      command$: () => chainCommand().insertGallery$()
    },
  ]

  const contentBasedMenuItems = (): ISlashCommandMenuItem[] => [
    {
      name$: "Details",
      icon$: BsInfoCircleFill,
      // @ts-ignore
      command$: () => chainCommand().setDetails()
    },
    {
      name$: "Table",
      icon$: BsTable,
      command$: () => chainCommand().insertTable()
    },
    {
      name$: "Todo",
      icon$: BsCheck2Square,
      command$: () => chainCommand().toggleTaskList()
    },
  ]

  const otherMenuItems = (): ISlashCommandMenuItem[] => [
    {
      name$: "Local embed",
      icon$: BsWindowSplit,
      command$: () => chainCommand().insertLocalEmbed$()
    },
  ]

  return (
    <div {...stylex.attrs(style.menu)}>
      <For each={contentBasedMenuItems()}>
        {it => <MenuItem {...it} />}
      </For>
      <Divider />
      <For each={mediaBasedMenuItems()}>
        {it => <MenuItem {...it} />}
      </For>
      <Divider />
      <For each={otherMenuItems()}>
        {it => <MenuItem {...it} />}
      </For>
    </div>
  )
}