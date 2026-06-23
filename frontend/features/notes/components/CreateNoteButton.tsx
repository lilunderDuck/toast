import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { Button, Tooltip } from "~/components"
import { createLazyComponent } from "~/hooks"
// ...
import { useNoteHomeContext } from "../provider"

const button = css`
  display: flex;
  justify-content: center;
  align-items: center;
`

export function CreateNoteButton() {
  const { addGroup$ } = useNoteHomeContext()
  const CreateNoteDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("./dialog/editing/CreateOrEditNoteDialog"),
    () => ({
      onSubmit$: addGroup$
    })
  )

  return (
    <>
      <Tooltip label$="Create new jounal groups">
        <Button 
          class={button} 
          onClick={CreateNoteDialog.show$}
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
          <BsPlus size={20} />
        </Button>
      </Tooltip>
      <CreateNoteDialog.Component$ />
    </>
  )
}