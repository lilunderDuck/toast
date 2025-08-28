import { BsPlus } from "solid-icons/bs"
import { type Accessor, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { SpinningCube, Tooltip } from "~/components"
import { type FileUploadComponent } from "~/features/native"
import { ASSETS_SERVER_URL } from "~/api"

const style = stylex.create({
  uploadZone: {
    cursor: "pointer",
    borderRadius: 6,
    ":hover": {
      border: "2px solid var(--gray7)"
    }
  },
  uploadZoneNoImage: {
    backgroundColor: "var(--gray3)",
  }
})

interface IIconUploadInputProps {
  uploadComponent$: FileUploadComponent
  isUploading$: Accessor<boolean>
  iconPath$: Accessor<string>
}

export default function IconUploadInput(props: IIconUploadInputProps) {
  return (
    <Tooltip label$="Choose a image for the cover">
      <props.uploadComponent$ 
        {...stylex.attrs(
          style.uploadZone,
          props.iconPath$() !== "" ? shorthands.background_image$ : style.uploadZoneNoImage,
          shorthands.wh_full$,
          shorthands.flex_center$,
        )}
        style={{
          "--img-url": `url(${ASSETS_SERVER_URL}/preview?path=${encodeURIComponent(props.iconPath$())})`
        }}
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