import { required } from "@modular-forms/solid"
// ...
import { Button, createIconInput, DialogContent, DialogHeader, FieldInput } from "~/components"
import { createSubmitForm, type ILazyDialog } from "~/hooks"
import type { editor } from "~/wailsjs/go/models"
import { playlistTrackUrl } from "~/api"
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

type PlaylistTrackSchema = {
  name: string
  author?: string
  description?: string
}

interface IPlaylistEditTrackItemDialogProps extends ILazyDialog {
  prevData$: editor.PlaylistItemData
  context$: IPlaylistContext
  currentTrackIndex$: number
}

export default function PlaylistCreateEditTrackDialog(props: IPlaylistEditTrackItemDialogProps) {
  const { items$, playlistId$ } = props.context$

  const IconInput = createIconInput({
    dialogOptions$: {
      Title: "Choose an image file to be used as track icon.",
    },
    inputSize$: "9rem",
    initialIconUrl$: () => playlistTrackUrl(playlistId$(), props.prevData$.fileName),
  })

  const { Form$, Field$ } = createSubmitForm<PlaylistTrackSchema>({
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
      items$.update$(props.currentTrackIndex$, {
        ...data,
        iconPath: IconInput.file$()
      } as editor.CreatePlaylistItemOptions)
      props.close$()
    }
  })

  return (
    <DialogContent>
      <DialogHeader>Edit track details.</DialogHeader>
      <div {...stylex.attrs(style.dialog__inputContent)}>
        <IconInput.Input$ />
        <Form$>
          <Field$ name="name" validate={[required("This field is required.")]}>
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Track name"
                error={field.error}
                value={field.value || props.prevData$?.name}
              />
            )}
          </Field$>

          <Field$ name="author">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Author"
                error={field.error}
                value={field.value || props.prevData$?.author}
              />
            )}
          </Field$>

          <Field$ name="description">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Description"
                error={field.error}
                value={field.value || props.prevData$?.description}
              />
            )}
          </Field$>
        </Form$>
      </div>
    </DialogContent>
  )
}