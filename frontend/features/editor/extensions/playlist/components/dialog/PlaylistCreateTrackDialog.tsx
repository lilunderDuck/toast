import { Show } from "solid-js"
import { BsPlus } from "solid-icons/bs"
import { createForm, required } from "@modular-forms/solid"
// ...
import { Button, DialogContent, DialogHeader, FieldInput, FieldInputLabel, SpinningCube, Tooltip, type ILazyDialog } from "~/components"
import { createFileUpload, SUPPORTED_AUDIO_FILTER, SUPPORTED_IMAGE_FILTER } from "~/features/native"
import { createSubmitForm } from "~/hooks"
import { ASSETS_SERVER_URL, escapeCssUrl, PREVIEW_FILE_URL } from "~/api"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type IPlaylistContext } from "../../provider"
import type { editor } from "~/wailsjs/go/models"

const style = stylex.create({
  dialog__inputContent: {
    display: "flex",
    gap: 15
  },
  dialog__audioFileUpload: {
    width: "100%",
    height: "6rem",
    borderRadius: 6,
    backgroundColor: "var(--gray3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    userSelect: "none"
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
  context$: IPlaylistContext
}

export default function PlaylistCreateTrackDialog(props: IPlaylistEditTrackItemDialogProps) {
  const [, { Form, Field }] = createForm<PlaylistTrackSchema>()
  const { trackItems$ } = props.context$

  const IconFileUpload = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an image file to be used as track icon.",
      Filters: [SUPPORTED_IMAGE_FILTER]
    }
  })

  const AudioFileUpload = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an audio file.",
      Filters: [SUPPORTED_AUDIO_FILTER]
    }
  })

  const { Form$ } = createSubmitForm(Form, {
    submitButtonText$: "Create",
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
      await trackItems$.add$({
        ...data,
        audioFilePath: AudioFileUpload.file$(),
        iconPath: IconFileUpload.file$()
      })
      props.close$()
    }
  })

  return (
    <DialogContent showCloseButton$={false} style={{
      "--icon-url": escapeCssUrl(`${PREVIEW_FILE_URL}${IconFileUpload.file$()}`)
    }}>
      <DialogHeader>Add new track.</DialogHeader>
      <FieldInputLabel>
        Audio file
      </FieldInputLabel>
      <Tooltip label$="Click to upload an audio file">
        <div {...stylex.attrs(style.dialog__audioFileUpload)} onClick={AudioFileUpload.open$}>
          <Show when={AudioFileUpload.file$()} fallback={"*No file choosen*"}>
            <audio 
              src={`${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(AudioFileUpload.file$()!)}`}
              controls
            />
          </Show>
        </div>
      </Tooltip>
      <div {...stylex.attrs(style.dialog__inputContent)}>
        <div>
          <FieldInputLabel>
            Cover icon
          </FieldInputLabel>
          <div {...stylex.attrs(style.dialog__iconInput)} onClick={IconFileUpload.open$}>
            <Show when={!IconFileUpload.file$()}>
              {IconFileUpload.isUploading$() ? <SpinningCube cubeSize$={20} /> : <BsPlus />}
            </Show>
          </div>
        </div>
        <Form$>
          <Field name="name" validate={[required("This field is required.")]}>
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Track name"
                error={field.error}
                value={field.value}
              />
            )}
          </Field>

          <Field name="author">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Author"
                error={field.error}
                value={field.value}
              />
            )}
          </Field>

          <Field name="description">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Description"
                error={field.error}
                value={field.value}
              />
            )}
          </Field>
        </Form$>
      </div>
    </DialogContent>
  )
}