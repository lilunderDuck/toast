import { required } from "@modular-forms/solid"
import { DEBUG_INFO_LABEL } from "macro-def"
import { css } from "molcss"
import { Button, DialogContent, FieldInput, Label } from "~/components"
import { createFileUpload, createIconInput, createLazyComponent, createSubmitForm, type IBaseLazyComponent } from "~/hooks"
import { Playlist_ensureValidStructure } from "~/wailsjs/go/playlist/Exports"
import { useCollectionPageContext } from "../../provider"

type PlaylistSchema = {
  name: string
} // playlist.PlaylistData

const dialog__iconInputWrap = css`
  display: flex;
  align-items: center;
  gap: 15px;
`

interface ICreatePlaylistDialogProps extends IBaseLazyComponent {
}

export default function CreatePlaylistDialog(props: ICreatePlaylistDialogProps) {
  const { toastRegistry$ } = useCollectionPageContext()

  const PlaylistIconInput = createIconInput({
    dialogOptions$: {
      Title: "Please choose an image file as the playlist icon"
    },
    tooltipLabel$: "Choose an image file for the icon",
    inputHeight$: "12rem",
    inputWidth$: "12rem"
  })

  const PlaylistBackgroundImgInput = createIconInput({
    dialogOptions$: {
      Title: "Please choose an image file as the playlist cover"
    },
    tooltipLabel$: "Choose an image file for the cover",
    inputHeight$: "12rem",
    inputWidth$: "100%"
  })

  const PlaylistErrorHintDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("../dialog/PlaylistErrorHintDialog"),
    () => ({})
  )

  const ExistingPlaylistPathInput = createFileUpload({
    type$: FileUploadType.DIRECTORY,
    dialogOptions$: {
      Title: "Please choose the folder storing your existing playlist"
    },
    async onFinish$(directory) {
      DEBUG_INFO_LABEL("CreatePlaylistDialog", "choosen directory:", directory)
      try {
        await Playlist_ensureValidStructure(directory)
      } catch(error) {
        DEBUG_INFO_LABEL("CreatePlaylistDialog", "error while trying to check playlist structure:", error)
        toastRegistry$.show$('InvalidPlaylistToast$', {
          error$: error,
          showHintDialog$: PlaylistErrorHintDialog.show$
        })
        return
      }
    }
  })

  const { Form$, Field$ } = createSubmitForm<PlaylistSchema>({
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
    <DialogContent class={css`width: 40rem;`} showCloseButton$={false}>
      <h2>
        Create playlist
      </h2>

      <Form$ class={''}>
        <Field$ name="name" validate={[required("You must provide the playlist name")]}>
          {(field, inputProps) => <FieldInput
            {...inputProps}
            placeholder={"Something unserious, or: \"A playlist to lock the crap in\""}
            label="Playlist name"
            error={field.error}
            value={field.value}
            required
          />}
        </Field$>
        <section class={dialog__iconInputWrap}>
          <div>
            <Label>Icon image</Label>
            <PlaylistIconInput.IconInput$ />
          </div>
          <div class={css`width: 100%;`}>
            <Label>Cover image</Label>
            <PlaylistBackgroundImgInput.IconInput$ />
          </div>
        </section>
      </Form$>

      <PlaylistErrorHintDialog.Component$ />
    </DialogContent>
  )
}