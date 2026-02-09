import { Button, DialogContent, DialogTitle, Input } from "~/components"
import { createSubmitForm, type IBaseLazyDialog } from "~/hooks"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  dialog: {
    width: "45%"
  }
})

export interface IEditTableTabDialogProps extends IBaseLazyDialog {
  oldTitle$?: string
  onSubmit$(data: { newTitle$: string }): any
}

export default function EditTableTabDialog(props: IEditTableTabDialogProps) {
  const { Form$, Field$ } = createSubmitForm<{ newTitle$: string }>({
    onSubmit$(data) {
      props.onSubmit$(data)
      props.close$()
    },
    submitButtonText$: props.oldTitle$ ? "Edit" : "Create",
    buttonRow$: (
      <Button
        variant$={ButtonVariant.DANGER}
        size$={ButtonSize.SMALL}
        onClick={props.close$}
      >
        Dismiss
      </Button>
    )
  })

  return (
    <DialogContent showCloseButton$={false} {...stylex.attrs(style.dialog)}>
      <DialogTitle>
        Edit table tab name.
      </DialogTitle>
      <Form$>
        <Field$ name="newTitle$">
          {(_, inputProps) => (
            <Input
              type="text"
              placeholder={props.oldTitle$}
              value={props.oldTitle$}
              {...inputProps}
            />
          )}
        </Field$>
      </Form$>
    </DialogContent>
  )
}