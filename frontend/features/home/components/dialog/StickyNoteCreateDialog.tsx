import { Button, DialogContent, DialogHeader, FieldInput, HexColorInput, Input, Label } from "~/components";
import { createSubmitForm, type IBaseLazyDialog } from "~/hooks";

import stylex from "@stylexjs/stylex"
import { required } from "@modular-forms/solid";
import { createSignal } from "solid-js";

const style = stylex.create({
  dialog: {
    width: "45%"
  }
})

interface IStickyNoteCreateDialogProps extends IBaseLazyDialog {
  // define your component props here
  onSubmit$(data: {
    title: string
    content: string
  }): void
}

export default function StickyNoteCreateDialog(props: IStickyNoteCreateDialogProps) {
  const [color, setColor] = createSignal("#313244")

  const { Form$, Field$ } = createSubmitForm<{
    title: string
    content: string
    color?: string
  }>({
    onSubmit$(data) {
      data.color = color()
      props.onSubmit$(data)
      props.close$()
    },
    submitButtonText$: "Create",
    buttonRow$: (
      <Button size$={ButtonSize.SMALL} variant$={ButtonVariant.DANGER} onClick={props.close$}>
        Discard
      </Button>
    )
  })

  return (
    <DialogContent {...stylex.attrs(style.dialog)} showCloseButton$={false}>
      <DialogHeader>
        Create sticky note
      </DialogHeader>

      <Label>
        Background color
      </Label>
      <HexColorInput 
        color$={color} 
        setColor$={setColor} 
      />

      <Form$>
        <Field$ name="title" validate={[required("This field is required")]}>
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="The sticky note title"
            label="Title"
            error={field.error}
            value={field.value}
          />}
        </Field$>
        <Field$ name="content" validate={[required("This field is required")]}>
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="Anything inside here, you can use markdown syntax in here too."
            label="Content"
            multiline={true}
            error={field.error}
            value={field.value}
          />}
        </Field$>
      </Form$>
    </DialogContent>
  )
}