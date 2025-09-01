import { Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { ButtonRow, Spacer } from "~/components"
// ...
import { useGalleryContext } from "../provider"
import { FullscreenButton, UploadButton, NextAndPrevButtons } from "./buttons"

const style = stylex.create({
  buttonRow: {
    position: "absolute",
    top: 0,
    width: "100%",
    zIndex: 11,
    paddingInline: 10
  },
  buttonRow__name: {
    borderRadius: 6,
    paddingInline: 10,
    paddingBlock: 5,
    backgroundColor: "var(--gray1)"
  }
})

export function GalleryButtonRow() {
  const { currentItem$ } = useGalleryContext()

  return (
    <ButtonRow {...stylex.attrs(style.buttonRow)} direction$={ButtonRowDirection.CUSTOM}>
      <UploadButton />
      <FullscreenButton />
      <Show when={currentItem$()}>
        <div {...stylex.attrs(style.buttonRow__name)}>
          {currentItem$()?.name}
        </div>
      </Show>
      <Spacer />
      <NextAndPrevButtons />
    </ButtonRow>
  )
}