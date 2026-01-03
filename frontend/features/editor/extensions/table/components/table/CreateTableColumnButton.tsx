import { BsThreeDotsVertical } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { createLazyLoadedDialog } from "~/hooks"
import { Button, Tooltip } from "~/components"
import { EditorEditModeOnly } from "~/features/editor/components"
// ...
import { useTablesDataContext } from "../../provider"

const style = stylex.create({
  button: {
    height: "100%"
  }
})

export default function CreateTableColumnButton() {
  const { event$ } = useTablesDataContext()

  const TableCreateColumnDialog = createLazyLoadedDialog(
    () => import("../dialog/TableCreateColumnDialog"),
    () => ({
      onSubmit$(schema) {
        event$.emit$(TableEvent.INSERT_COLUMN, schema.name, schema.type)
      }
    })
  )

  return (
    <EditorEditModeOnly>
      <Tooltip label$="Create column">
        <Button
          variant$={ButtonVariant.NO_BACKGROUND}
          size$={ButtonSize.SMALL}
          onClick={TableCreateColumnDialog.show$}
          {...stylex.attrs(style.button)}
        >
          <BsThreeDotsVertical />
        </Button>
      </Tooltip>
      <TableCreateColumnDialog.Dialog$ />
    </EditorEditModeOnly>
  )
}