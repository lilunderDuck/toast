import { JSX, Show, type Accessor } from "solid-js"
import { BsPlus } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { createFileUpload, SUPPORTED_IMAGE_FILTER, type FileOpenDialogOptions } from "~/hooks"
import { previewUrl } from "~/api"
import { SpinningCube, Tooltip } from "~/components"
import { DEBUG_WARN_LABEL } from "macro-def"

const uploadZone = css`
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--icon-input-size);
  height: var(--icon-input-size);
`

const uploadZone__disabled = css`
  cursor: not-allowed;
`

const uploadZone__allowed = css`
  border: 4px solid transparent;
  &:hover {
    border-color: var(--blue);
  }
`

const uploadZone__withImage = css`
  background: center center no-repeat var(--icon-input-img-url);
  background-size: cover;
`

const uploadZone__noImage = css`
  background-color: var(--base);
`

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
    disabled$: options.disabled$,
    dialogOptions$: {
      ...options.dialogOptions$,
      Filters: [SUPPORTED_IMAGE_FILTER]
    }
  })

  const isDisabled = options.disabled$ ?? (() => false)
  const hasNoIcon = () => !file$()
  const iconPreviewUrl = () => previewUrl(file$()!)

  const inputClasses = () => `${uploadZone} ${isDisabled() ? uploadZone__disabled : uploadZone__allowed} ${hasNoIcon() ? uploadZone__noImage : uploadZone__withImage}`

  return {
    file$: file$,
    isUploading$: isUploading$,
    IconInput$: () => (
      <Tooltip label$={options.tooltipLabel$ ?? "Click to choose an image."}>
        <div 
          onClick={open$}
          class={inputClasses()}
          style={`--icon-input-img-url:url('${file$() ? iconPreviewUrl() : options.initialIconUrl$?.()}');--icon-input-size:${options.inputSize$}`}
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