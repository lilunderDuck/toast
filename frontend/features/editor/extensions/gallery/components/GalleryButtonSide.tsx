import stylex from "@stylexjs/stylex"
import { BsArrowLeft, BsArrowRight } from "solid-icons/bs"
import { Button } from "~/components"
import { useGalleryContext } from "../provider"

const style = stylex.create({
  gallery__buttonOnTheSide: {
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    opacity: 0.3,
    transition: "0.15s ease-out",
    ":hover": {
      opacity: 1
    }
  },
  gallery__backButtonWrap: {
    left: 0,
    paddingLeft: 10
  },
  gallery__nextButtonWrap: {
    right: 0,
    paddingRight: 10
  },
  gallery__button: {
    zIndex: 10,
    position: "relative"
  }
})

export function LeftButtonSide() {
  const { previous$, data$, currentIndex$ } = useGalleryContext()
  return (
    <div {...stylex.attrs(style.gallery__buttonOnTheSide, style.gallery__backButtonWrap)}>
      <Button
        size$={ButtonSize.ICON}
        onClick={previous$}
        disabled={currentIndex$() === 0 || !data$()}
        {...stylex.attrs(style.gallery__button)}
      >
        <BsArrowLeft />
      </Button>
    </div>
  )
}

export function RightButtonSide() {
  const { next$, data$, currentIndex$ } = useGalleryContext()

  return (
    <div {...stylex.attrs(style.gallery__buttonOnTheSide, style.gallery__nextButtonWrap)}>
      <Button
        size$={ButtonSize.ICON}
        onClick={next$}
        disabled={currentIndex$() === data$()?.items?.length || !data$()}
        {...stylex.attrs(style.gallery__button)}
      >
        <BsArrowRight />
      </Button>
    </div>
  )
}