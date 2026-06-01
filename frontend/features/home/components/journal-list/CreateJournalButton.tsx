import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { Button, Tooltip } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { useJournalHomeContext } from "../../provider/JournalHomeProvider"

const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

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
          class={button} 
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