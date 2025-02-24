import { createDropzone } from "@soorria/solid-dropzone"
import { BsCaretLeftFill, BsCaretRightFill } from "solid-icons/bs"
// ...
import { api_saveGalleryImage, api_saveImage } from "~/api/media"
import { Button, ButtonSizeVariant, FlexCenterY, Spacer } from "~/components"
import { useJournalContext } from "~/features/journal"
import { useResource } from "~/hook"
// ...
import stylex from "@stylexjs/stylex"
// ...
import GalleryList from "./GalleryList"
import { useGalleryDataContext } from "../data"
import { Show } from "solid-js"
import { useEditorContext } from "~/features/editor"

const style = stylex.create({
  buttonRow: {
    gap: 10
  }
})

export function GallerySideView() {
  const { sessionStorage$ } = useJournalContext()
  const { page$, galleryId$, addImages$ } = useGalleryDataContext()
  const { isReadonly$ } = useEditorContext()

  const { fetch$, isLoading$ } = useResource(async(targetFile: File[]) => {
    const currentGroupId = sessionStorage$.get$('currentGroup').id
    const fileNames = []
    for (const file of targetFile) {
      const newFileName = await api_saveGalleryImage(currentGroupId, galleryId$, file)
      fileNames.push(newFileName)
    }

    addImages$(fileNames)
  })

  const dropzone = createDropzone({
    accept: ['.jpg', '.png'],
    async onDrop(acceptedFiles: File[]) {
      await fetch$(acceptedFiles)
    }
  })

  const getGalleryListProps = () => isReadonly$() ? {} : dropzone.getRootProps()
  
  return (
    <div>
      <GalleryList {...getGalleryListProps()} />
      <FlexCenterY {...stylex.attrs(style.buttonRow)}>
        <Button size$={ButtonSizeVariant.icon} onClick={() => page$.focusPrevious$()}>
          <BsCaretLeftFill />
        </Button>
        <Button size$={ButtonSizeVariant.icon} onClick={() => page$.focusNext$()}>
          <BsCaretRightFill />
        </Button>
        <Spacer />
        <Show when={isLoading$()}>
          <div>Loading</div>
        </Show>
        <div>
          {page$.currentPage$() + 1} / {page$.totalPage$()}
        </div>
      </FlexCenterY>
    </div>
  )
}