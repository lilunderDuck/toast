import { BsPlus } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createLazyLoadedDialog } from "~/hooks"
import { useStickyNotesContext } from "../../provider/StickyNotesProvider"

const style = stylex.create({
  block: {
    width: "13.5rem",
    height: "12rem",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--mantle)",
    color: "var(--subtext0)",
    ":hover": {
      backgroundColor: "var(--base)",
      color: "var(--text)",
    }
  }
})

export function StickyNoteCreateButton() {
  const { addStickyNote$ } = useStickyNotesContext()

  const { Dialog$, show$ } = createLazyLoadedDialog(
    () => import("../dialog/StickyNoteCreateDialog"),
    () => ({
      onSubmit$(data) {
        addStickyNote$(data)
      },
    })
  )

  return (
    <>
      <button {...stylex.attrs(style.block)} onClick={show$}>
        <BsPlus size={30} />
      </button>
      <Dialog$ />
    </>
  )
}