import { createSignal } from "solid-js"
import { required } from "@modular-forms/solid"
// ...
import "./StickyNoteCreateDialog.css"
import { css } from "molcss"
// ...
import { Button, DialogContent, DialogHeader, FieldInput, HexColorInput, Label } from "~/components"
import { createSubmitForm, type IBaseLazyDialog } from "~/hooks"
import { sticky_notes } from "~/wailsjs/go/models"
import { makeId } from "~/utils"

const dialog = css`
  width: 70%;
`

const dialog__formSplitView = css`
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 10px;
`

const dialog__formPanel = css`
  width: 100%;
  height: 100%;
`

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
    <DialogContent class={dialog} showCloseButton$={false}>
      <DialogHeader>
        Create sticky note
      </DialogHeader>

      <Form$>
        <div class={dialog__formSplitView}>
          <div class={dialog__formPanel} id="stickyNoteDialog__leftPanel">
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
          <div class={dialog__formPanel} id="stickyNoteDialog__rightPanel">
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