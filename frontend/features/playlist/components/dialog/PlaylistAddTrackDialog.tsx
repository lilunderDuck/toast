import { required } from "@modular-forms/solid"
import { BsPlus } from "solid-icons/bs"
import { Show } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Button, DialogContent, FieldInput, Label } from "~/components"
import { createFileUpload, createSubmitForm, type IBaseLazyComponent, createIconInput } from "~/hooks"
import type { playlist } from "~/wailsjs/go/models"
import { previewUrl } from "~/api"

const dialog = css`
  width: 70%;
`

const dialog__audioFileDialog = css`
  width: 100%;
  height: 7rem;
  background-color: var(--base);
  color: var(--subtext0);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 4px solid transparent;
  border-radius: 6px;
  &:hover {
    color: var(--text);
    border-color: var(--blue);
  }
`

const dialog__inputSplitView = css`
  display: flex;
  gap: 10px;
  padding-top: 10px;
`

const dialog__inputRightView = css`
  width: 100%;
`

type PlaylistAddTrackSchema = {
  name: string
  artist: string
  iconPath?: string
  trackPath: string
} // playlist.PlaylistCreateTrackOption

interface IPlaylistAddTrackDialogProps extends IBaseLazyComponent {
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
      <Button variant$={ButtonVariant.DANGER} onClick={props.close$}>
        Discard
      </Button>
    )
  })

  return (
    <DialogContent class={dialog}>
      <h2>
        Add new track
      </h2>
      
      <Label>Audio file</Label>
      <div
        onClick={openAudioFileDialog}
        class={dialog__audioFileDialog}
      >
        <Show when={audioFile()} fallback={
          <BsPlus />
        }>
          <audio src={previewUrl(audioFile() ?? "")} controls />
        </Show>
      </div>
      <Form$>
        <div class={dialog__inputSplitView}>
          <div>
            <Label>Track icon</Label>
            <IconInput$ />
          </div>
          <div class={dialog__inputRightView}>
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