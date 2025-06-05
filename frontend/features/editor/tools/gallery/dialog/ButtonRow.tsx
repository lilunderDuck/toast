import { BsArrowLeft, BsArrowRight } from "solid-icons/bs"
// ...
import { Button, ButtonSizeVariant, Flex } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { IGalleryDataContext, useGalleryDataContext } from "../data"
import { ParentProps } from "solid-js"

const style = stylex.create({
  buttonRow: {
    gap: 5,
    position: 'absolute',
    backgroundColor: "var(--gray1)",
    paddingBlock: 5,
    paddingInline: 15,
    opacity: 0.25,
    borderRadius: 6,
    zIndex: 1,
    userSelect: "none",
    ":hover": {
      opacity: 1,
    }
  }
})

export default function ButtonRow(props: ParentProps<IGalleryDataContext>) {
  const { page$ } = useGalleryDataContext()
  
  return (
    <Flex {...stylex.attrs(style.buttonRow)}>
      <Button size$={ButtonSizeVariant.icon} onClick={page$.focusNext$}>
        <BsArrowLeft />
      </Button>
      <Button size$={ButtonSizeVariant.icon} onClick={page$.focusPrevious$}>
        <BsArrowRight />
      </Button>
      <div />
      <div />
      {page$.currentPage$()} / {page$.totalPage$()}
      <div />
      {props.children}
    </Flex>
  )
}