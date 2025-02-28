import { onMount, Show } from "solid-js"
import { createDropzone } from "@soorria/solid-dropzone"
// ...
import { Input, Tooltip } from "~/components"
import { api_saveImage, api_deleteImage, api_getImageSavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { useResource } from "~/hook"
import { editorLog } from "~/features/debug"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ImageInput.module.css"
// ...
import { useImageDataContext } from "./ImageDataProvider"
import { FullViewButton, ImageInputAndDropzone } from "./ui"

const style = stylex.create({
  theInput: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'var(--gray3)',
    borderRadius: 6,
  },
  fullScreenButton: {
    right: 0,
    paddingTop: 5,
    paddingRight: 5
  }
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
      <Tooltip label$="Click to choose an image" class={__style.input}>
        <div {...stylex.attrs(style.theInput)}>
          <ImageInputAndDropzone 
            dropzoneRootProps$={dropzone.getRootProps()}
            isLoading$={isLoading$()}
            imageSrc$={localImageUrl()} 
          />
          <Show when={localImageUrl()}>
            <FullViewButton imageSrc$={localImageUrl() as string} />
          </Show>
        </div>
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