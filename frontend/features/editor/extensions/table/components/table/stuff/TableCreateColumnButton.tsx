import { BsPlus } from "solid-icons/bs"
// ...
import { Button } from "~/components"
import { createLazyLoadedDialog } from "~/hooks"
// ...
import { useTableContext } from "../../../provider"

export function TableCreateColumnButton() {
  const { createColumn$ } = useTableContext()
  
  const TableCreateColumnDialog = createLazyLoadedDialog(
    () => import("./dialog/TableCreateColumnDialog"),
    () => ({
      onSubmit$(schema) {
        createColumn$(schema.name, schema.type)
      },
    })
  )

  return (
    <>
      <Button
        size$={ButtonSize.ICON}
        variant$={ButtonVariant.NO_BACKGROUND}
        onClick={TableCreateColumnDialog.show$}
      >
        <BsPlus />
      </Button>
      <TableCreateColumnDialog.Dialog$ />
    </>
  )
}