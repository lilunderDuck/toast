import { Show } from "solid-js"
// ...
import { Button, createIconInput, DialogContent, DialogHeader, FieldInput, FieldInputLabel, Tooltip } from "~/components"
import { createSubmitForm, createFileUpload, SUPPORTED_AUDIO_FILTER, type ILazyDialog } from "~/hooks"
import { GetAudioDataFrom } from "~/wailsjs/go/editor/EditorExport"
import { previewUrl } from "~/api"
import { toast } from "~/libs/solid-toast"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type IPlaylistContext } from "../../provider"

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
  const { items$ } = props.context$

  const IconFileUpload = createIconInput({
    dialogOptions$: {
      Title: "Choose an image file to be used as track icon.",
    },
    inputSize$: "9rem",
  })

  const AudioFileUpload = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an audio file.",
      Filters: [SUPPORTED_AUDIO_FILTER]
    }
  })

  const fetchSelectedAudio = async() => {
    console.log(AudioFileUpload.file$())
    const data = await toast.promise(GetAudioDataFrom(AudioFileUpload.file$()!), {
      loading: "Fetching audio data...",
      error: "Failed to fetch audio data.",
      success: "Successfully fetched audio data."
    })

    setFieldData$({
      name: data.title!,
      author: data.artist,
    })

    if (data.iconPath) {
      AudioFileUpload.setFilePath$(data.iconPath)
    }
  }

  const { Form$, Field$, setFieldData$ } = createSubmitForm<PlaylistTrackSchema>({
    submitButtonText$: "Create",
    buttonRow$: (
      <>
        <Button
          size$={ButtonSize.SMALL}
          variant$={ButtonVariant.DANGER}
          onClick={props.close$}
        >
          Dismiss
        </Button>
        <Button
          size$={ButtonSize.SMALL}
          onClick={fetchSelectedAudio}
          disabled={!AudioFileUpload.file$()}
        >
          Fetch selected audio
        </Button>
      </>
    ),
    async onSubmit$(data) {
      await items$.add$({
        ...data,
        audioFilePath: AudioFileUpload.file$(),
        iconPath: IconFileUpload.file$()
      })
      props.close$()
    }
  })

  return (
    <DialogContent showCloseButton$={false}>
      <DialogHeader>Add new track.</DialogHeader>
      <FieldInputLabel>
        Audio file
      </FieldInputLabel>
      <Tooltip label$="Click to upload an audio file">
        <div {...stylex.attrs(style.dialog__audioFileUpload)} onClick={AudioFileUpload.open$}>
          <Show when={AudioFileUpload.file$()} fallback={"*No file choosen*"}>
            <audio 
              src={previewUrl(AudioFileUpload.file$()!)}
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
          <IconFileUpload.Input$ />
        </div>
        <Form$>
          <Field$ name="name">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Track name"
                placeholder="Awesome track"
                error={field.error}
                value={field.value}
              />
            )}
          </Field$>

          <Field$ name="author">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Author"
                placeholder="Someone"
                error={field.error}
                value={field.value}
              />
            )}
          </Field$>

          <Field$ name="description">
            {(field, inputProps) => (
              <FieldInput
                {...inputProps}
                label="Description"
                placeholder="What is this track is about, for example."
                error={field.error}
                value={field.value}
              />
            )}
          </Field$>
        </Form$>
      </div>
    </DialogContent>
  )
}