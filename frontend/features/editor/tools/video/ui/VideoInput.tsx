import { createSignal, Show } from "solid-js"
import { BsPlus } from "solid-icons/bs"
// ...
import { api_getVideoSavedPath, api_saveVideo } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { createFileUpload, FileUploadType } from "~/features/file-uploads"
import { useEditorContext } from "~/features/editor/provider"
import { FlexCenter, SpinningCube } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Video } from "../components"
import { useVideoDataContext } from "../data"

const style = stylex.create({
  dialogHitbox: {
    width: '100%',
    height: '100%'
  },
  emptyVideo: {
    border: '1px solid var(--gray8)',
    borderRadius: 6
  }
})

interface IVideoInputProps {
  // ...
}

export function VideoInput(props: IVideoInputProps) {
  const { isReadonly$ } = useEditorContext()
  const { sessionStorage$ } = useJournalContext()
  const { data$, setData$ } = useVideoDataContext()

  const isThereAVideo = () => data$.videoUrl !== ""
  const [isLoading, setIsLoading] = createSignal(isThereAVideo())
  const currentGroupId = sessionStorage$.get$("currentGroup").id

  let shouldShowDialog = true
  const FileUploadDialog = createFileUpload({
    type$: FileUploadType.file,
    options$: {
      Title: "Please choose a video file",
      Filters: [
        { DisplayName: "Ofc you need a video file here", Pattern: "*.mp4" }
      ]
    },
    async onFinish$(theFilePath) {
      setIsLoading(true)
      const fileName = await api_saveVideo(currentGroupId, theFilePath)
      setData$("videoUrl", () => fileName)
      setIsLoading(false)
    },
    shouldShow$: () => shouldShowDialog
  })

  const LoadingSpinner = () => (
    <Show when={isLoading()}>
      <FlexCenter {...stylex.attrs(style.dialogHitbox)}>
        <SpinningCube cubeSize$={30} />
      </FlexCenter>
    </Show>
  )

  const DialogInputThing = () => (
    <Show when={!isThereAVideo()}>
      <FlexCenter {...stylex.attrs(style.dialogHitbox)}>
        <BsPlus />
      </FlexCenter>
    </Show>
  )

  return (
    <div
      {...stylex.attrs(isThereAVideo() ? {} : style.emptyVideo)}
    >
      <Video
        videoUrl={api_getVideoSavedPath(currentGroupId, data$.videoUrl)}
        onVideoLoaded$={() => setIsLoading(false)}
      >
        <Show when={!isReadonly$()}>
          <LoadingSpinner />
          <DialogInputThing />
          <FileUploadDialog {...stylex.attrs(style.dialogHitbox)} />
        </Show>
      </Video>
    </div>
  )
}