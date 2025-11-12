import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  layer: {
    width: "100%",
    height: "100%",
    position: "absolute"
  }
})

interface ILayerProps extends HTMLAttributes<"div"> {
}

export function Layer(props: ILayerProps) {
  return (
    <div {...props} class={macro_mergeClassnames(props, stylex.attrs(style.layer))} />
  )
}