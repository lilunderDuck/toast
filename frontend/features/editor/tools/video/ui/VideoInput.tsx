import { createDropzone } from "@soorria/solid-dropzone"
import { useEditorContext } from "~/features/editor/provider"
import { useResource } from "~/hook"
import { Video } from "../components"
import { useJournalContext } from "~/features/journal"
import { api_getImageSavedPath, api_getVideoSavedPath, api_saveImage } from "~/api/media"
import { useVideoDataContext } from "../data"

interface IVideoInputProps {
  // ...
}

export function VideoInput(props: IVideoInputProps) {
  const { isReadonly$ } = useEditorContext()
  const { sessionStorage$ } = useJournalContext()
  const { data$, setData$ } = useVideoDataContext()
  const currentGroupId = sessionStorage$.get$("currentGroup").id

  const videoResource = useResource(async(targetFile: File) => {
    const videoName = await api_saveImage(currentGroupId, targetFile)
    setData$("videoUrl", () => videoName)
    return videoName
  })

  const dropzone = createDropzone({
    accept: ['.mp4'],
    maxFiles: 1,
    async onDrop(acceptedFiles: File[]) {
      console.log(acceptedFiles)
    }
  })

  const getInputProps = () => isReadonly$() ? {} : dropzone.getRootProps()

  return (
    <div {...getInputProps()}>
      <Video 
        videoUrl={api_getImageSavedPath(currentGroupId, data$.videoUrl)}
        isLoading$={videoResource.isLoading$()}
      />
    </div>
  )
}