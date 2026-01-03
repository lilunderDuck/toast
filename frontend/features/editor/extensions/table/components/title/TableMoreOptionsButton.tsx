import { BsThreeDots } from "solid-icons/bs"
// ...
import { createLazyLoadedDialog, createLazyLoadedDropdownMenu } from "~/hooks"
import { Button } from "~/components"
// ...
import { useTablesDataContext } from "../../provider"

export function TableMoreOptionsButton() {
  const { tabs$, deleteTable$ } = useTablesDataContext()

  const EditTableTabDialog = createLazyLoadedDialog(
    () => import("../dialog/EditTableTabDialog"),
    () => ({
      oldTitle$: tabs$.getCurrentFocused$().name,
      onSubmit$(data) {
        const currentTab = tabs$.getCurrentFocused$()
        tabs$.update$(currentTab.id, {
          name: data.newTitle$
        })
      },
    })
  )

  const TableDeleteConfirmationDialog = createLazyLoadedDialog(
    () => import("../dialog/TableDeleteConfirmationDialog"),
    () => ({
      onConfirmDeletion$: deleteTable$,
    })
  )

  const TableMoreOptionsDropdownMenu = createLazyLoadedDropdownMenu(
    () => import("./TableMoreOptionsDropdownMenu"),
    () => ({
      totalTabs$: tabs$.get$().length,
      action$(action) {
        switch (action) {
          case TableMoreOptionsDropdownAction.EDIT_CURRENT_TAB:
            return EditTableTabDialog.show$()
          case TableMoreOptionsDropdownAction.DELETE_CURRENT_TAB:
            throw 'Not working on this case yet'
          case TableMoreOptionsDropdownAction.DELETE_ALL:
            return TableDeleteConfirmationDialog.show$()
        }
      },
    })
  )

  return (
    <>
      <TableMoreOptionsDropdownMenu.DropdownMenu$>
        <Button
          size$={ButtonSize.ICON}
          variant$={ButtonVariant.NO_BACKGROUND}
        >
          <BsThreeDots />
        </Button>
      </TableMoreOptionsDropdownMenu.DropdownMenu$>
      <EditTableTabDialog.Dialog$ />
      <TableDeleteConfirmationDialog.Dialog$ />
    </>
  )
}