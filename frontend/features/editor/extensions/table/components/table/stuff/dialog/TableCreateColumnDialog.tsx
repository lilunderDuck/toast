import { createSignal } from "solid-js"
// ...
import { DialogContent, DialogTitle, FieldInput } from "~/components"
import { createSubmitForm, type ILazyDialog } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import ColumnTypeSelectInput from "./ColumnTypeSelectInput"

const style = stylex.create({
  dialog: {
    width: "45%"
  }
})

interface ITableCreateColumnDialogProps extends ILazyDialog {
  onSubmit$(schema: TableColumnSchema): void
}

type TableColumnSchema = {
  type: TableDataType
  name: string
}

export default function TableCreateColumnDialog(props: ITableCreateColumnDialogProps) {
  const [columnType, setColumnType] = createSignal<TableDataType>()
  const { Form$, Field$ } = createSubmitForm<TableColumnSchema>({
    async onSubmit$(data) {
      if (!columnType()) return console.warn('[table] column type havent\'t been choosen yet.')
      data.type = columnType()!
      props.onSubmit$(data)
      props.close$()
    },
    submitButtonText$: "Create"
  })

  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <DialogTitle>
        Create new column
      </DialogTitle>

      <Form$>
        <ColumnTypeSelectInput
          value$={columnType()}
          // @ts-ignore - hacky
          onChange$={setColumnType}
        />
        <Field$ name="name">
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="Column name"
            label="Description"
            error={field.error}
            value={field.value}
          />}
        </Field$>
      </Form$>
    </DialogContent>
  )
}