import { Show } from "solid-js"
// ...
import { Input } from "~/components"
import { api_saveImage, api_deleteImage, api_getImageSavedPath } from "~/api/media"
import { useJournalContext } from "~/features/journal"
import { createFileUpload, FileUploadType } from "~/features/file-uploads"
import { toast } from "~/features/toast"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ImageInput.module.css"
// ...
import { useImageDataContext } from "./provider/ImageDataProvider"
import { FullViewButton, ImageInputAndDropzone, ImageWrap } from "./ui"
import { useEditorContext } from "../../provider"

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
  const { getCurrentGroup$ } = useJournalContext()
  const { update$, data$ } = useImageDataContext()
  const { isReadonly$ } = useEditorContext()

  const { FileUploadZone$, isUploading$ } = createFileUpload({
    type$: FileUploadType.file,
    title$: "Please choose an image file.",
    async onFinish$(file) {
      const currentGroupId = getCurrentGroup$().id
      const isExistPrevImage = data$().imgName !== ""
      if (isExistPrevImage) {
        await api_deleteImage(currentGroupId, data$().imgName)
      }

      const newFileName = await api_saveImage(currentGroupId, file)
      if (!newFileName) {
        toast.error("Failed to save image")
        return
      }

      update$({
        imgName: newFileName.result
      })
    },
  })

  const updateDescription: EventHandler<"input", "onInput"> = (inputEvent) => {
    update$({
      description: inputEvent.currentTarget.value
    })
  }

  const getImageSrc = () => data$().imgName !== "" ?
    api_getImageSavedPath(getCurrentGroup$().id, data$().imgName) :
    ""
  // ...

  return (
    <div>
      <div {...stylex.attrs(style.theInput)}>
        <ImageWrap
          tooltipLabel$="Click to choose an image"
          UploadZoneComponent$={FileUploadZone$}
        >
          <ImageInputAndDropzone
            isLoading$={isUploading$()}
            imageSrc$={getImageSrc()}
          />
        </ImageWrap>
        <FullViewButton imageSrc$={data$().imgName} />
      </div>
      <Show when={!isReadonly$()}>
        <Input
          placeholder="Optional description here"
          disabled={isUploading$()}
          value={data$().description}
          onInput={updateDescription}
        />
      </Show>
    </div>
  )
}