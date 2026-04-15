import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
// ...
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { useJournalHomeContext } from "../../provider/JournalHomeProvider"

const style = stylex.create({
  button: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

export function CreateJournalButton() {
  const { addGroup$ } = useJournalHomeContext()
  const CreateJournalDialog = createLazyLoadedDialog(
    () => import("../dialog/editing/CreateOrEditJournalDialog"),
    () => ({
      onSubmit$: addGroup$
    })
  )

  return (
    <>
      <Tooltip label$="Create new jounal groups">
        <Button 
          {...stylex.attrs(style.button)} 
          onClick={CreateJournalDialog.show$}
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
          <BsPlus size={20} />
        </Button>
      </Tooltip>
      <CreateJournalDialog.Dialog$ />
    </>
  )
}