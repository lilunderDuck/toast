import { Show } from "solid-js"
import { BsImageFill } from "solid-icons/bs"
// ...
import { createFileUpload, SUPPORTED_IMAGE_PATTERN } from "~/features/native"
import { UploadFile } from "~/wailsjs/go/editor/EditorExport"
import { useJournalContext } from "~/features/journal"
import { ASSETS_SERVER_URL } from "~/api"
import { createLazyLoadedDialog, SpinningCube } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./ImageInput.module.css"
// ...
import type { ImageAttribute } from "./data"
import { Image } from "./Image"
import ImageButtonRow from "./ImageButtonRow"

const style = stylex.create({
  input: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
    position: "relative"
  },
  input__layer: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  input__uploadZone: {
    borderRadius: 6,
    border: "2px solid var(--gray6)",
    flexFlow: "column",
    gap: 10
  },
  input__editButton: {
    position: "absolute",
    top: 0,
    right: 0,
    marginRight: 10
  },
  input__theImageItself: {
    height: "-webkit-fill-available"
  }
})

interface IImageInputProps {
  data$?: ImageAttribute
  onChange$(data: string): void | Promise<void>
}

export function ImageInput(props: IImageInputProps) {
  const { sessionStorage$ } = useJournalContext()
  const groupId = () => sessionStorage$.get$('journal_data$').groupId$
  const { open$, isUploading$, error$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      Title: "Choose an image file for your journal group cover.",
      Filters: [
        { DisplayName: "Images file", Pattern: SUPPORTED_IMAGE_PATTERN }
      ]
    },
    async onFinish$(filePath) {
      const fileName = await UploadFile(groupId(), filePath, "media")
      await props.onChange$(fileName)
    },
  })

  const ImageFullviewDialog = createLazyLoadedDialog(
    () => import("./ImageFullviewDialog"),
    () => ({
      src$: getImageUrl()
    })
  )

  const openFileDialog = () => {
    open$()
  }

  const getImageUrl = () => `${ASSETS_SERVER_URL}/local-assets/${groupId()}/media/${props.data$!.name}` as const

  return (
    <>
      <div {...stylex.attrs(style.input)} id={__style.input}>
        <Show when={props.data$?.name == ""} fallback={
          <>
            <ImageButtonRow
              openFileDialog$={openFileDialog}
              openImageFullview$={ImageFullviewDialog.show$}
            />
            <Image src$={getImageUrl()} {...stylex.attrs(style.input__theImageItself)} />
          </>
        }>
          <div {...stylex.attrs(style.input__layer, style.input__uploadZone)} onClick={openFileDialog}>
            <Show when={isUploading$() && !error$()} fallback={
              <BsImageFill size={30} />
            }>
              <SpinningCube cubeSize$={20} />
            </Show>
            Click to select a image.
          </div>
        </Show>
      </div>
      <ImageFullviewDialog.Dialog$ />
    </>
  )
}