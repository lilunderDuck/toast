import stylex from "@stylexjs/stylex"
import { JSX, Show, type Accessor } from "solid-js"
import { createFileUpload, SUPPORTED_IMAGE_FILTER, type FileOpenDialogOptions } from "~/hooks"
import { BsPlus } from "solid-icons/bs"
import { previewUrl } from "~/api"
import { CLS } from "macro-def"
import { SpinningCube, Tooltip } from "~/components"

const style = stylex.create({
  uploadZone: {
    cursor: "pointer",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "var(--icon-input-size)",
    height: "var(--icon-input-size)",
  },
  uploadZone__disabled: {
    cursor: "not-allowed",
  },
  uploadZone__allowed: {
    border: "4px solid transparent",
    ":hover": {
      borderColor: "var(--blue)"
    }
  },
  uploadZone__withImage: {
    background: "center center no-repeat var(--icon-input-img-url)",
    backgroundSize: "cover"
  },
  uploadZone__noImage: {
    backgroundColor: "var(--base)",
  }
})

interface IIconInputOptions {
  inputSize$: string
  tooltipLabel$?: JSX.Element
  initialIconUrl$?: () => string
  dialogOptions$: Omit<FileOpenDialogOptions, "Filters">
  disabled$?: Accessor<boolean>
}

export function createIconInput(options: IIconInputOptions) {
  const { open$, isUploading$, file$ } = createFileUpload({
    type$: FileUploadType.FILE,
    dialogOptions$: {
      ...options.dialogOptions$,
      Filters: [SUPPORTED_IMAGE_FILTER]
    }
  })

  const hasNoIcon = () => !file$()
  const iconPreviewUrl = () => previewUrl(file$()!)

  const inputClasses = () => `${CLS(style.uploadZone)} ${(options.disabled$ ?? (() => false))() ? CLS(style.uploadZone__disabled) : CLS(style.uploadZone__allowed)} ${hasNoIcon() ? CLS(style.uploadZone__noImage) : CLS(style.uploadZone__withImage)}`

  return {
    file$: file$,
    isUploading$: isUploading$,
    IconInput$: () => (
      <Tooltip label$={options.tooltipLabel$ ?? "Click to choose an image."}>
        <div 
          onClick={open$}
          class={inputClasses()}
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