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
  const [, { Form, Field }] = createForm<PlaylistTrackSchema>()
  const { trackItems$ } = props.context$

  const [iconName, setIconName] = createSignal<string | undefined>(props.prevData$?.icon ?? "")
  const [iconPath, setIconPath] = createSignal<string>()

  const { isUploading$, open$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an image file to be used as track icon.",
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
      trackItems$.update$(props.currentTrackIndex$, data as editor.CreatePlaylistItemOptions)
      props.close$()
    }
  })

  return (
    <DialogContent style={{
      "--icon-url": escapeCssUrl(`${PREVIEW_FILE_URL}${iconPath()}`)
    }}>
      <DialogHeader>Edit track details.</DialogHeader>
      <div {...stylex.attrs(style.dialog__inputContent)}>
        <div {...stylex.attrs(style.dialog__iconInput)} onClick={open$}>
          <Show when={!iconName()}>
            {isUploading$() ? <SpinningCube cubeSize$={20} /> : <BsPlus />}
          </Show>
        </div>
        <Form$>
          <Field name="name" validate={[required("This field is required.")]}>
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Track name"
                error={field.error}
                value={field.value || props.prevData$?.name}
              />
            )}
          </Field>

          <Field name="author">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Author"
                error={field.error}
                value={field.value || props.prevData$?.author}
              />
            )}
          </Field>

          <Field name="description">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Description"
                error={field.error}
                value={field.value || props.prevData$?.description}
              />
            )}
          </Field>
        </Form$>
      </div>
    </DialogContent>
  )
}