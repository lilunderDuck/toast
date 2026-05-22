import { Button, DialogContent, DialogHeader, FieldInput, HexColorInput, Label } from "~/components";
import { createSubmitForm, type IBaseLazyDialog } from "~/hooks";

import stylex from "@stylexjs/stylex"
import "./StickyNoteCreateDialog.css"
import { required } from "@modular-forms/solid";
import { createSignal } from "solid-js";
import { sticky_notes } from "~/wailsjs/go/models";
import { makeId } from "~/utils";

const style = stylex.create({
  dialog: {
    width: "70%"
  },
  dialog__formSplitView: {
    display: "grid",
    gridTemplateColumns: "1fr 1.5fr",
    gap: 10
  },
  dialog__formPanel: {
    width: "100%",
    height: "100%"
  }
})

interface IStickyNoteCreateDialogProps extends IBaseLazyDialog {
  // define your component props here
  onSubmit$(data: sticky_notes.StickyNoteData): void
}

type StickyNoteSchema = sticky_notes.StickyNoteData

export default function StickyNoteCreateDialog(props: IStickyNoteCreateDialogProps) {
  const [color, setColor] = createSignal("#313244")

  const { Form$, Field$, clearFields$ } = createSubmitForm<StickyNoteSchema>({
    onSubmit$(data) {
      data.color = color()
      // Implementation note: in reality, you shouldn't do this in a real app.
      // But for a simple sticky note that saves the data in the computer,
      // it should be good enough.
      data.id = makeId(20)
      props.onSubmit$(data)
      props.close$()
      clearFields$()
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

      <Form$>
        <div {...stylex.attrs(style.dialog__formSplitView)}>
          <div {...stylex.attrs(style.dialog__formPanel)} id="stickyNoteDialog__leftPanel">
            <Field$ name="title" validate={[required("This field is required")]}>
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="The sticky note title"
                label="Title"
                error={field.error}
                value={field.value}
              />}
            </Field$>
            <Label>
              Background color
            </Label>
            <HexColorInput 
              color$={color} 
              setColor$={setColor} 
            />
          </div>
          <div {...stylex.attrs(style.dialog__formPanel)} id="stickyNoteDialog__rightPanel">
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
          </div>
        </div>
      </Form$>
    </DialogContent>
  )
}