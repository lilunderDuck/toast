import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
// ...
import { createLazyLoadedDialog, Tooltip } from "~/components"
import { shorthands } from "~/styles/shorthands"
import { useJournalHomeContext } from "../provider"

const style = stylex.create({
  button: {
    width: "10rem",
    height: "10rem",
  }
})

export function CreateJournalButton() {
  const { addGroup$ } = useJournalHomeContext()
  const CreateJournalDialog = createLazyLoadedDialog(
    () => import("./dialogs/CreateJournalDialog"),
    () => ({
      onSubmit$: addGroup$
    })
  )

  return (
    <>
      <Tooltip label$="Create new jounal groups">
        <button 
          {...stylex.attrs(style.button, shorthands.flex_center$)} 
          onClick={CreateJournalDialog.show$}
          data-block
        >
          <BsPlus size={20} />
        </button>
      </Tooltip>
      <CreateJournalDialog.Modal$ />
    </>
  )
}