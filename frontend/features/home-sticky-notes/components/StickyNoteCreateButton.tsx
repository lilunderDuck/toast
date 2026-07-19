import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { createLazyComponent } from "~/hooks"
import { useStickyNotesContext } from "../provider/StickyNotesProvider"

const block = css`
  width: 13.5rem;
  height: 12rem;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--mantle);
  color: var(--subtext0);
  &:hover {
    background-color: var(--base);
    color: var(--text);
  }
`

export function StickyNoteCreateButton() {
  const { addStickyNote$ } = useStickyNotesContext()

  const StickyNoteCreateDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("./dialog/StickyNoteCreateDialog"),
    () => ({
      onSubmit$(data) {
        addStickyNote$(data)
      },
    })
  )

  return (
    <>
      <button class={block} onClick={StickyNoteCreateDialog.show$}>
        <BsPlus size={30} />
      </button>
      <StickyNoteCreateDialog.Component$ />
    </>
  )
}