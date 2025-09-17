import { DropdownMenuContent, DropdownMenuItem, type IDropdownMenu } from "~/components"
import { BsImageFill, BsLayoutSplit } from "solid-icons/bs"
import { For } from "solid-js"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  menu__itemContent: {
    display: "flex",
    gap: 10
  },
  menu__description: {
    fontSize: 14,
    color: "var(--gray11)"
  }
})

interface IUploadDropdownMenu extends IDropdownMenu {
  onChange$(mode: GalleryViewMode): void
}

export default function ChangeViewDropdownMenu(props: IUploadDropdownMenu) {
  const callEvent = (mode: GalleryViewMode) => () => props.onChange$(mode)

  const options = [
    { icon$: BsImageFill, name$: "Single view", value$: GalleryViewMode.SINGLE_ITEM, description$: "Only showing a single gallery item." },
    { icon$: BsLayoutSplit, name$: "Split view", value$: GalleryViewMode.SINGLE_ITEM, description$: "Showing 2 gallery item on the left and right." }
  ]
  
  return (
    <DropdownMenuContent>
      <For each={options}>
        {it => (
          <DropdownMenuItem onClick={callEvent(it.value$)}>
            <div {...stylex.attrs(style.menu__itemContent)}>
              <it.icon$ />
              <span>{it.name$}</span>
            </div>
            <p {...stylex.attrs(style.menu__description)}>{it.description$}</p>
          </DropdownMenuItem>
        )}
      </For>
    </DropdownMenuContent>
  )
}