import { splitProps } from "solid-js"
import { useCarouselContext } from "./CarouselProvider"

import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  item: {"flexBasis":"100%","flexGrow":0,"shrink":"0","minWidth":"0"},
  item_horizontal: {"paddingTop":"1rem"},
  item_otherDirection: {"paddingLeft":"1rem"}
})

export function CarouselItem(props: HTMLAttributes<"div">) {
  const [local, others] = splitProps(props, ["class"])
  const { orientation } = useCarouselContext()
 
  return (
    <div
      role="group"
      aria-roledescription="slide"
      class={mergeClassname(
        stylex.attrs(
          style.item,
          orientation === "horizontal" ? style.item_horizontal : style.item_otherDirection,
        ),
        local
      )}
      {...others}
    />
  )
}