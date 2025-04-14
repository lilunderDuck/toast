import { createSignal, Show } from "solid-js"
import { BsPlus } from "solid-icons/bs"
// ...
import { api_getVideoSavedPath, api_saveVideo } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { createFileUpload, FileUploadType } from "~/features/file-uploads"
import { useEditorContext } from "~/features/editor/provider"
import { FlexCenter, SpinningCube, Tooltip } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./VideoInput.module.css"
// ...
import { useVideoDataContext } from "./data"
import { Video } from "./ui"

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

export function VideoInput() {
  const { isReadonly$ } = useEditorContext()
  const { getCurrentGroup$ } = useJournalContext()
  const { data$, setData$ } = useVideoDataContext()

  const isThereAVideo = () => data$.videoUrl !== ""
  const [isVideoLoading, setIsVideoLoading] = createSignal(isThereAVideo())
  const currentGroupId = getCurrentGroup$().id

  let shouldShowDialog = true
  const { FileUploadZone$, isUploading$ } = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please choose a video file",
    filter$() {
      return [
        { name: "Ofc you need a video file here", extension: "mp4" }
      ]
    },
    async onFinish$(theFilePath) {
      const fileName = await api_saveVideo(currentGroupId, theFilePath)
      setData$("videoUrl", () => fileName)
    },
    shouldShow$: () => shouldShowDialog
  })

  const LoadingSpinner = () => (
    <Show when={isUploading$() || isVideoLoading()}>
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
        onVideoLoaded$={() => setIsVideoLoading(false)}
      >
        <Show when={!isReadonly$()}>
          <LoadingSpinner />
          <DialogInputThing />
          <FileUploadZone$ {...stylex.attrs(style.dialogHitbox)} id={__style.tooltip}>
            <Tooltip label$="Click to upload a video file.">
              <div {...stylex.attrs(style.dialogHitbox)} />
            </Tooltip>
          </FileUploadZone$>
        </Show>
      </Video>
    </div>
  )
}