import type { ParentProps } from "solid-js"
import { BsCaretLeftFill, BsCaretRightFill } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Button, ButtonSizeVariant, FlexCenterY, Spacer, Tooltip } from "~/components"
// ...
import { useGalleryDataContext } from "../data"

const style = stylex.create({
  buttonRow: {
    gap: 10,
    userSelect: 'none'
  }
})

export default function GalleryButtonRow(props: ParentProps) {
  const { page$ } = useGalleryDataContext()

  return (
    <FlexCenterY {...stylex.attrs(style.buttonRow)}>
      <Tooltip label$="Previous">
        <Button size$={ButtonSizeVariant.icon} onClick={() => page$.focusPrevious$()}>
          <BsCaretLeftFill />
        </Button>
      </Tooltip>
      <Tooltip label$="Next">
        <Button size$={ButtonSizeVariant.icon} onClick={() => page$.focusNext$()}>
          <BsCaretRightFill />
        </Button>
      </Tooltip>
      <Spacer />
      {props.children}
      <div>
        {page$.currentPage$() + 1} / {page$.totalPage$()}
      </div>
    </FlexCenterY>
  )
}