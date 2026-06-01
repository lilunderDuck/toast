import { BsPlus } from "solid-icons/bs"
import { type Accessor, type Component, Show } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { SpinningCube, Tooltip } from "~/components"
import { ASSETS_SERVER_URL } from "~/api"

const uploadZone = css`
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  &:hover {
    border: 2px solid var(--overlay0);
  }
`

const uploadZone__withImage = css`
  background: center center no-repeat var(--img-url);
  background-size: cover;
`

const uploadZone__noImage = css`
  background-color: var(--base);
`

interface IIconUploadInputProps {
  uploadComponent$: Component<HTMLAttributes<"div">>
  isUploading$: Accessor<boolean>
  iconPath$: Accessor<string>
}

export default function IconUploadInput(props: IIconUploadInputProps) {
  return (
    <Tooltip label$="Choose a image for the cover">
      <props.uploadComponent$ 
        class={`${uploadZone} ${props.iconPath$() ? uploadZone__withImage : uploadZone__noImage}`}
        style={`--img-url:url(${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(props.iconPath$())})`}
      >
        <Show when={props.iconPath$() == ""}>
          <Show when={props.isUploading$()} fallback={
            <BsPlus size={20} />
          }>
            <SpinningCube cubeSize$={20} />
          </Show>
        </Show>
      </props.uploadComponent$>
    </Tooltip>
  )
}