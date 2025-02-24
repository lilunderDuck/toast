import { BsPlus } from "solid-icons/bs"
import { onMount, Show } from "solid-js"
import { createDropzone } from "@soorria/solid-dropzone"
// ...
import { FlexCenter, Input, Tooltip } from "~/components"
import { api_saveImage, api_deleteImage, api_getImageSavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { useResource } from "~/hook"
import { editorLog } from "~/features/debug"
// ...
import stylex from "@stylexjs/stylex"
import { useImageDataContext } from "./ImageDataProvider"

const style = stylex.create({
  theInput: {
    position: 'relative',
    width: '100%',
    marginBottom: 10
  },
  imageEmpty: {
    height: '15rem',
    width: '100%',
    position: 'absolute',
  },
})

export default function ImageInput() {
  const { sessionStorage$ } = useJournalContext()
  const { update$, data$ } = useImageDataContext()

  let prevImageName = data$().imgName
  const { fetch$, isLoading$, data$: localImageUrl } = useResource(async(targetFile: File | string) => {
    const currentGroupId = sessionStorage$.get$('currentGroup').id

    if (typeof targetFile === "string") {
      //debug-start
      editorLog.logLabel("image", "loading image", targetFile)
      //debug-end
      return api_getImageSavedPath(currentGroupId, targetFile)
    }

    const newFileName = await api_saveImage(currentGroupId, targetFile)

    if (prevImageName) {
      await api_deleteImage(currentGroupId, prevImageName)
    }

    update$({
      imgName: newFileName
    })

    prevImageName = newFileName
    return api_getImageSavedPath(currentGroupId, newFileName)
  })

  const dropzone = createDropzone({
    accept: ['.jpg', '.png'],
    maxFiles: 1,
    async onDrop(acceptedFiles: File[]) {
      const targetFile = acceptedFiles[0]
      await fetch$(targetFile)
    }
  })

  const updateDescription: EventHandler<"input", "onInput"> = (inputEvent) => {
    update$({ 
      description: inputEvent.currentTarget.value
    })
  }

  onMount(() => {
    if (prevImageName === '') return 
    fetch$(prevImageName)
  })
  
  return (
    <div>
      <Tooltip label$="Click to choose an image">
        <div {...dropzone.getRootProps()} {...stylex.attrs(style.theInput)}>
          <Show when={localImageUrl()} fallback={
            <FlexCenter {...stylex.attrs(style.imageEmpty)}>
              <BsPlus />
            </FlexCenter>
          }>
            <img src={localImageUrl()} />
          </Show>
        </div>
        <Show when={isLoading$()}>
          <div>
            Uploading image...
          </div>
        </Show>
      </Tooltip>
      <Input 
        placeholder="Optional description here" 
        disabled={isLoading$()} 
        value={data$().description}
        onInput={updateDescription}
      />
    </div>
  )
}