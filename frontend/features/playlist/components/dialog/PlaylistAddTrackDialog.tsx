import { required } from "@modular-forms/solid"
import { Button, DialogContent, DialogHeader, FieldInput, Label } from "~/components"
import { createFileUpload, createSubmitForm, type IBaseLazyDialog, createIconInput } from "~/hooks"
import type { playlist } from "~/wailsjs/go/models"

import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"
import { Show } from "solid-js"
import { previewUrl } from "~/api"

const style = stylex.create({
  dialog: {
    width: "70%"
  },
  dialog__audioFileDialog: {
    width: "100%",
    height: "7rem",
    backgroundColor: "var(--base)",
    color: "var(--subtext0)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "4px solid transparent",
    borderRadius: 6,
    ":hover": {
      color: "var(--text)",
      borderColor: "var(--blue)"
    }
  },
  dialog__inputSplitView: {
    display: "flex",
    gap: 10,
    paddingTop: 10
  },
  dialog__inputRightView: {
    width: "100%"
  }
})

type PlaylistAddTrackSchema = {
  name: string
  artist: string
  iconPath?: string
  trackPath: string
} // playlist.PlaylistCreateTrackOption

interface IPlaylistAddTrackDialogProps extends IBaseLazyDialog {
  onSubmit$(data: playlist.PlaylistCreateTrackOption): any
}

export default function PlaylistAddTrackDialog(props: IPlaylistAddTrackDialogProps) {
  const { 
    open$: openAudioFileDialog, 
    file$: audioFile 
  } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Please choose a *.mp3 file for the track.",
      Filters: [{
        DisplayName: "Audio file",
        Pattern: "*.mp3"
      }],
    }
  })

  const shouldDisable = () => !audioFile() || audioFile() === ""

  const { 
    IconInput$, 
    file$: iconFile 
  } = createIconInput({
    tooltipLabel$: "Choose an icon as track icon",
    dialogOptions$: {
      Title: "Please choose an image file as the icon for the track.",
    },
    inputSize$: "10rem",
    disabled$: shouldDisable
  })

  const { Form$, Field$ } = createSubmitForm<PlaylistAddTrackSchema>({
    onSubmit$(data) {
      data.trackPath = audioFile() ?? ""
      data.iconPath = iconFile() ?? ""
      props.onSubmit$(data)
      props.close$()
    },
    submitButtonText$: "Add",
    buttonRow$: (
      <Button size$={ButtonSize.SMALL} variant$={ButtonVariant.DANGER} onClick={props.close$}>
        Discard
      </Button>
    )
  })

  return (
    <DialogContent {...stylex.attrs(style.dialog)}>
      <DialogHeader>
        Add new track
      </DialogHeader>
      
      <Label>Audio file</Label>
      <div
        onClick={openAudioFileDialog}
        {...stylex.attrs(style.dialog__audioFileDialog)}
      >
        <Show when={audioFile()} fallback={
          <BsPlus />
        }>
          <audio src={previewUrl(audioFile() ?? "")} controls />
        </Show>
      </div>
      <Form$>
        <div {...stylex.attrs(style.dialog__inputSplitView)}>
          <div>
            <Label>Track icon</Label>
            <IconInput$ />
          </div>
          <div {...stylex.attrs(style.dialog__inputRightView)}>
            <Field$ name="name" validate={[required("This field is required")]}>
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="Track name"
                label="Title"
                error={field.error}
                value={field.value}
                disabled={shouldDisable()}
              />}
            </Field$>
            <Field$ name="artist">
              {(field, inputProps) => <FieldInput
                {...inputProps}
                placeholder="Track artist"
                label="Artist"
                error={field.error}
                value={field.value}
                disabled={shouldDisable()}
              />}
            </Field$>
          </div>
        </div>
      </Form$>
    </DialogContent>
  )
}