import { BsFullscreen, BsPlus } from "solid-icons/bs"
import { lazy, onMount, Show } from "solid-js"
import { createDropzone } from "@soorria/solid-dropzone"
// ...
import { Button, ButtonSizeVariant, createLazyLoadedDialog, FlexCenter, FlexCenterY, Input, SpinningCube, Tooltip } from "~/components"
import { api_saveImage, api_deleteImage, api_getImageSavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { useResource } from "~/hook"
import { editorLog } from "~/features/debug"
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ImageInput.module.css"
// ...
import { useImageDataContext } from "./ImageDataProvider"

const style = stylex.create({
  theInput: {
    position: 'relative',
    width: '100%',
    marginBottom: 10,
    backgroundColor: 'var(--gray3)',
    borderRadius: 6,
    minWidth: '18rem'
  },
  imageEmpty: {
    height: '100%',
    width: '100%',
  },
  loading: {
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--gray5)',
    opacity: 0.7
  },
  displayOnTop: {
    position: 'absolute',
    top: 0,
  },
  input: {
    gap: 10
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

  const imageFullviewDialog = createLazyLoadedDialog(
    lazy(() => import("./ImageFullviewDialog")),
    () => ({
      imageSrc$: localImageUrl()
    })
  )
  
  return (
    <div>
      <Tooltip label$="Click to choose an image" class={__style.input}>
        <div {...stylex.attrs(style.theInput)}>
          <div {...dropzone.getRootProps()}>
            <Show when={localImageUrl()} fallback={
              <FlexCenter {...stylex.attrs(style.imageEmpty)}>
                <BsPlus />
              </FlexCenter>
            }>
              <img src={localImageUrl()} />
            </Show>
            <Show when={isLoading$()}>
              <FlexCenter {...stylex.attrs(style.displayOnTop, style.loading)}>
                <SpinningCube cubeSize$={36} />
              </FlexCenter>
            </Show>
          </div>
          <div class={mergeClassname(
            stylex.attrs(style.displayOnTop, style.fullScreenButton),
            __style.fullScreenButton
          )}>
            <Tooltip label$="Open in full view">
              <Button size$={ButtonSizeVariant.icon} onClick={() => {
                imageFullviewDialog.show$()
                console.log('clicked')
              }}>
                <BsFullscreen />
              </Button>
            </Tooltip>
          </div>
        </div>
      </Tooltip>
      <Input 
        placeholder="Optional description here" 
        disabled={isLoading$()} 
        value={data$().description}
        onInput={updateDescription}
      />
      <imageFullviewDialog.Modal$ />
    </div>
  )
}