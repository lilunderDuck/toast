import { required } from "@modular-forms/solid"
// ...
import { Button, createIconInput, DialogContent, DialogHeader, FieldInput } from "~/components"
import { createSubmitForm, type ILazyDialog } from "~/hooks"
import type { editor } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type IPlaylistContext } from "../../provider"

const style = stylex.create({
  dialog__inputContent: {
    display: "flex",
    gap: 15
  },
  dialog__iconInput: {
    width: "9rem",
    height: "9rem",
    borderRadius: 6,
    border: "2px solid transparent",
    background: "center center no-repeat var(--icon-url)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--gray3)",
    ":hover": {
      borderColor: "var(--gray7)"
    }
  }
})

type PlaylistMetadataSchema = {
  title: editor.PlaylistMetadata["title"]
  description?: editor.PlaylistMetadata["description"]
}

interface IPlaylistEditMetadataDialogProps extends ILazyDialog {
  prevData$: editor.PlaylistMetadata
  context$: IPlaylistContext
}

export default function PlaylistEditMetadataDialog(props: IPlaylistEditMetadataDialogProps) {
  const { editPlaylist$, playlistId$ } = props.context$

  const IconInput = createIconInput({
    dialogOptions$: {
      Title: "Choose an image file to be used as playlist icon."
    },
    inputSize$: '9rem',
    initialIconUrl$: () => `${ASSETS_SERVER_URL}/playlist/${playlistId$()}/icon/${props.prevData$.icon}`
  })

  const { Form$, Field$ } = createSubmitForm<PlaylistMetadataSchema>({
    submitButtonText$: "Edit",
    buttonRow$: (
      <Button
        size$={ButtonSize.SMALL}
        variant$={ButtonVariant.DANGER}
        onClick={props.close$}
      >
        Dismiss
      </Button>
    ),
    async onSubmit$(data) {
      editPlaylist$({
        ...data,
        icon: IconInput.file$()
      } as editor.PlaylistOptions)
    }
  })

  return (
    <DialogContent>
      <DialogHeader>Edit playlist details.</DialogHeader>
      <div {...stylex.attrs(style.dialog__inputContent)}>
        <IconInput.Input$ />
        <div>
          <Form$>
            <Field$ name="title" validate={[required("This field is required.")]}>
              {(field, inputProps) => (
                <FieldInput
                  {...inputProps}
                  placeholder="Amazing playlist"
                  label="Title"
                  error={field.error}
                  value={field.value || props.prevData$?.title}
                />
              )}
            </Field$>

            <Field$ name="description">
              {(field, inputProps) => (
                <FieldInput
                  {...inputProps}
                  placeholder="What does this playlist is about?"
                  label="Description"
                  error={field.error}
                  value={field.value || props.prevData$?.description}
                />
              )}
            </Field$>
          </Form$>
        </div>
      </div>
    </DialogContent>
  )
}