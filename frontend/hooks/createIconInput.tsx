import { JSX, Show, type Accessor } from "solid-js"
import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { createFileUpload, SUPPORTED_IMAGE_FILTER, type FileOpenDialogOptions } from "~/hooks"
import { previewUrl } from "~/api"
import { SpinningCube, Tooltip } from "~/components"
import { DEBUG_WARN_LABEL } from "macro-def"

export const uploadZone__root = css`
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--icon-input-width);
  height: var(--icon-input-height);
  &[data-upload-zone-disabled=true] {
    cursor: not-allowed;
  }

  &[data-upload-zone-disabled=false] {
    border: 4px solid transparent;
    &:hover {
      border-color: var(--blue);
    }
  }

  &[data-upload-zone-has-image=true] {
    background: center center no-repeat var(--icon-input-img-url);
    background-size: cover;
  }

  &[data-upload-zone-has-image=false] {
    background-color: var(--base);
  }
`

interface IIconInputOptions {
  inputWidth$?: string
  inputHeight$?: string
  tooltipLabel$?: JSX.Element
  initialIconUrl$?: () => string
  dialogOptions$: Omit<FileOpenDialogOptions, "Filters">
  disabled$?: Accessor<boolean>
}

export function createIconInput(options: IIconInputOptions) {
  const { open$, isUploading$, file$ } = createFileUpload({
    type$: FileUploadType.FILE,
    disabled$: options.disabled$,
    dialogOptions$: {
      ...options.dialogOptions$,
      Filters: [SUPPORTED_IMAGE_FILTER]
    }
  })

  const isDisabled = options.disabled$ ?? (() => false)
  const hasNoIcon = () => !file$()
  const iconPreviewUrl = () => previewUrl(file$()!)

  if (TOAST_DEBUG) {
    if (!options.inputWidth$) {
      DEBUG_WARN_LABEL("createIconInput()", "make sure to specify the inputWidth$ too")
    }

    if (!options.inputHeight$) {
      DEBUG_WARN_LABEL("createIconInput()", "make sure to specify the inputHeight$ too")
    }
  }

  return {
    file$: file$,
    isUploading$: isUploading$,
    IconInput$: () => (
      <Tooltip label$={options.tooltipLabel$ ?? "Click to choose an image."}>
        <div 
          onClick={open$}
          class={uploadZone__root}
          data-upload-zone-disabled={isDisabled()}
          data-upload-zone-has-image={!hasNoIcon()}
          style={`--icon-input-img-url:url('${file$() ? iconPreviewUrl() : options.initialIconUrl$?.()}');--icon-input-width:${options.inputWidth$};--icon-input-height:${options.inputHeight$}`}
        >
          <Show when={hasNoIcon()}>
            <Show when={isUploading$()} fallback={
              <BsPlus size={30} />
            }>
              <SpinningCube cubeSize$={20} />
            </Show>
          </Show>
        </div>
      </Tooltip>
    )
  }
}