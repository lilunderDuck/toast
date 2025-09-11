import { createSignal, Show } from "solid-js"
import { BsPlus } from "solid-icons/bs"
import { createForm, required } from "@modular-forms/solid"
// ...
import { Button, DialogContent, DialogHeader, FieldInput, SpinningCube, type ILazyDialog } from "~/components"
import { createFileUpload, SUPPORTED_IMAGE_FILTER } from "~/features/native"
import { getFilenameFromUrl } from "~/utils"
import { createSubmitForm } from "~/hooks"
import type { editor } from "~/wailsjs/go/models"
import { escapeCssUrl, PREVIEW_FILE_URL } from "~/api"
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
  const [, { Form, Field }] = createForm<PlaylistMetadataSchema>()
  const { editPlaylist$ } = props.context$

  const [iconName, setIconName] = createSignal<string | undefined>(props.prevData$.icon)
  const [iconPath, setIconPath] = createSignal<string>()

  const { isUploading$, open$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an image file to be used as playlist icon.",
      Filters: [SUPPORTED_IMAGE_FILTER]
    },
    onFinish$(file) {
      const fileName = getFilenameFromUrl(file)
      setIconName(fileName)
      setIconPath(file)
    },
  })

  const { Form$ } = createSubmitForm(Form, {
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
      editPlaylist$(data as editor.PlaylistOptions)
    }
  })

  return (
    <DialogContent style={{
      "--icon-url": escapeCssUrl(`${PREVIEW_FILE_URL}${iconPath()}`)
    }}>
      <DialogHeader>Edit playlist details.</DialogHeader>
      <div {...stylex.attrs(style.dialog__inputContent)}>
        <div {...stylex.attrs(style.dialog__iconInput)} onClick={open$}>
          <Show when={!iconName()}>
            {isUploading$() ? <SpinningCube /> : <BsPlus />}
          </Show>
        </div>
        <div>
          <Form$>
            <Field name="title" validate={[required("This field is required.")]}>
              {(field, inputProps) => (
                <FieldInput
                  {...inputProps}
                  placeholder="Amazing playlist"
                  label="Title"
                  error={field.error}
                  value={field.value || props.prevData$?.title}
                />
              )}
            </Field>

            <Field name="description">
              {(field, inputProps) => (
                <FieldInput
                  {...inputProps}
                  placeholder="What does this playlist is about?"
                  label="Description"
                  error={field.error}
                  value={field.value || props.prevData$?.description}
                />
              )}
            </Field>
          </Form$>
        </div>
      </div>
    </DialogContent>
  )
}