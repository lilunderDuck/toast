import { mergeProps, splitProps } from "solid-js"
// ...
import { CarouselButtonProps, useCarouselContext } from "./CarouselProvider"
import { Button, ButtonSizeVariant, ButtonVariant } from "../Button"
// ...

import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  button: {
    position: "absolute",
    borderRadius: "50%",
    touchAction: "manipulation",
  },
  button_horizontal: {
    left: "-3rem",
    top: "50%",
  },
  button_otherDirection: {
    left: "-3rem",
    top: "50%",
    rotate: '90deg'
  },
  icon: {
    width: 15,
    height: 15
  }
})

export function CarouselPrevious(rawProps: CarouselButtonProps) {
  const props = mergeProps<CarouselButtonProps[]>({
    variant$: ButtonVariant.outline, 
    size$: ButtonSizeVariant.icon 
  }, rawProps)
  const [local, others] = splitProps(props, ["class", "variant$", "size$"])
  const { orientation, scrollPrev, canScrollPrev } = useCarouselContext()
 
  return (
    <Button
      variant={local.variant$}
      size={local.size$}
      class={mergeClassname(
        stylex.attrs(
          style.button,
          orientation === "horizontal" ? style.button_horizontal : style.button_otherDirection
        ),
        local
      )}
      disabled={!canScrollPrev()}
      onClick={scrollPrev}
      {...others}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        {...stylex.attrs(style.icon)}
      >
        <path d="M5 12l14 0" />
        <path d="M5 12l6 6" />
        <path d="M5 12l6 -6" />
      </svg>
      <span class="sr-only">Previous slide</span>
    </Button>
  )
}