import { BsPlus } from "solid-icons/bs"
// ...
import { Button } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"

export function TableCreateColumnButton() {
  const TableCreateRowDialog = createLazyLoadedDialog(
    () => import("./TableCreateColumnDialog")
  )

  return (
    <>
      <Button
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
        onClick={TableCreateRowDialog.show$}
      >
        <BsPlus />
      </Button>
      <TableCreateRowDialog.Dialog$ />
    </>
  )
}