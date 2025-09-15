import stylex from "@stylexjs/stylex"
import { JSX, Show } from "solid-js"
import { Tooltip } from "../ui"
import { createFileUpload, SUPPORTED_IMAGE_FILTER, type FileOpenDialogOptions } from "~/features/native"
import { BsPlus } from "solid-icons/bs"
import { SpinningCube } from "../loader"
import { previewUrl } from "~/api"

const style = stylex.create({
  uploadZone: {
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "var(--icon-input-size)",
    height: "var(--icon-input-size)",
    ":hover": {
      border: "2px solid var(--gray7)"
    }
  },
  uploadZone__withImage: {
    background: "center center no-repeat var(--icon-input-img-url)",
    backgroundSize: "cover"
  },
  uploadZone__noImage: {
    backgroundColor: "var(--gray3)",
  }
})

interface IIconInputOptions {
  inputSize$: string
  tooltipLabel$?: JSX.Element
  initialIconUrl$?: () => string
  dialogOptions$: Omit<FileOpenDialogOptions, "Filters">
}

export function createIconInput(options: IIconInputOptions) {
  const { open$, isUploading$, file$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      ...options.dialogOptions$,
      Filters: [SUPPORTED_IMAGE_FILTER]
    }
  })

  const hasNoIcon = () => !options.initialIconUrl$?.() || !file$()
  const iconPreviewUrl = () => previewUrl(file$()!)

  return {
    file$: file$,
    isUploading$: isUploading$,
    Input$: () => (
      <Tooltip label$={options.tooltipLabel$ ?? "Click to choose an image."}>
        <div 
          onClick={open$}
          {...stylex.attrs(
            style.uploadZone,
            hasNoIcon() ? style.uploadZone__noImage : style.uploadZone__withImage,
          )}
          style={{
            "--icon-input-img-url": `url('${file$() ? iconPreviewUrl() : options.initialIconUrl$?.()}')`,
            "--icon-input-size": options.inputSize$
          }}
        >
          <Show when={hasNoIcon()}>
            <Show when={isUploading$()} fallback={
              <BsPlus size={20} />
            }>
              <SpinningCube cubeSize$={20} />
            </Show>
          </Show>
        </div>
      </Tooltip>
    )
  }
}