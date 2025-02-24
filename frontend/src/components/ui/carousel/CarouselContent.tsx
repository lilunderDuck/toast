import { splitProps } from "solid-js"
// ...
import { mergeClassname } from "~/utils"
// ...
import { useCarouselContext } from "./CarouselProvider"
import { Flex } from "../Flex"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  content: {
    overflow: 'hidden'
  },
  content_horizontal: {"marginLeft":"-1rem"},
  content_otherDirection: {"marginTop":"-1rem","flexDirection":"column"}
})

export function CarouselContent(props: HTMLAttributes<"div">) {
  const [local, others] = splitProps(props, ["class"])
  const { carouselRef, orientation } = useCarouselContext()
 
  return (
    <div ref={carouselRef} {...stylex.attrs(style.content)}>
      <Flex
        class={mergeClassname(
          stylex.attrs(
            orientation === "horizontal" ? style.content_horizontal : style.content_otherDirection
          ),
          local.class
        )}
        {...others}
      />
    </div>
  )
}