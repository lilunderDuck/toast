import { BsThreeDots } from "solid-icons/bs"
// ...
import { createLazyLoadedDialog, createLazyLoadedDropdownMenu } from "~/hooks"
import { Button } from "~/components"
// ...
import { useTablesDataContext } from "../../provider"

interface ITableMoreOptionsButtonProps { }

export function TableMoreOptionsButton(props: ITableMoreOptionsButtonProps) {
  const { event$, tabs$, deleteTable$ } = useTablesDataContext()

  const TableCreateColumnDialog = createLazyLoadedDialog(
    () => import("./dialog/TableCreateColumnDialog"),
    () => ({
      onSubmit$(schema) {
        event$.emit$(TableEvent.INSERT_COLUMN, schema.name, schema.type)
      },
    })
  )

  const EditTableTabDialog = createLazyLoadedDialog(
    () => import("./dialog/EditTableTabDialog"),
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
    () => import("./dialog/TableDeleteConfirmationDialog"),
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
          case TableMoreOptionsDropdownAction.INSERT_COLUMN:
            return TableCreateColumnDialog.show$()
          case TableMoreOptionsDropdownAction.INSERT_ROW:
            return event$.emit$(TableEvent.INSERT_ROW)
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
      <TableCreateColumnDialog.Dialog$ />
      <TableDeleteConfirmationDialog.Dialog$ />
    </>
  )
}