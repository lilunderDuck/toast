import { required } from "@modular-forms/solid"
import { css } from "molcss"
import { Button, DialogContent, FieldInput, Label } from "~/components"
import { createIconInput, createSubmitForm, type IBaseLazyComponent } from "~/hooks"

interface ICreateGalleryDialogProps extends IBaseLazyComponent {
}

export default function CreateGalleryDialog(props: ICreateGalleryDialogProps) {
  const PlaylistIconInput = createIconInput({
    dialogOptions$: {
      Title: "Please choose an image file as the gallery icon"
    },
    tooltipLabel$: "Choose an image file for the icon",
    inputHeight$: "12rem",
    inputWidth$: "100%"
  })

  const { Form$, Field$ } = createSubmitForm<{}>({
    submitButtonText$: "Create",
    buttonRow$: (
      <>
        <Button 
          variant$={ButtonVariant.DANGER} 
          onClick={props.close$}
        >
          Close
        </Button>
        {/* <Button onClick={ExistingPlaylistPathInput.open$}>
          Import existing playlist
        </Button> */}
      </>
    ),
    async onSubmit$(data) {
    }
  })

  return (
    <DialogContent class={css`width: 50%;`} showCloseButton$={false}>
      <h2>
        Create gallery
      </h2>

      <Form$>
        <Field$ name="name" validate={[required("You must provide the gallery name")]}>
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="Of course, you have to put the name here"
            label="Name"
            error={field.error}
            value={field.value}
            required
          />}
        </Field$>

        <Field$ name="description">
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder="What is this about?"
            label="Description"
            error={field.error}
            value={field.value}
            multiline={true}
          />}
        </Field$>

        <Label>Icon</Label>
        <PlaylistIconInput.IconInput$ />
      </Form$>
    </DialogContent>
  )
}