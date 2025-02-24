import stylex from "@stylexjs/stylex"
import __style from "./TextRenderer.module.css"
import { mergeClassname, StylexStylesAttribute } from "~/utils"
import { TextData } from "./data"

const style = stylex.create({
  bold: {
    fontWeight: 'bold'
  },
  italic: {
    fontStyle: 'italic'
  },
  underline: {
    textDecorationLine: 'underline'
  },
  strikethrough: {
    textDecoration: 'line-through'
  }
})

// I have absolutely no idea
export function TextRenderer(props: TextData) {
  const applyIfHas = (something: any, value: StylexStylesAttribute) => something ? value : ''

  return (
    <div
      class={mergeClassname(
        applyIfHas(props.bold, stylex.attrs(style.bold)),
        applyIfHas(props.italic, stylex.attrs(style.italic)),
        applyIfHas(props.strikethrough, stylex.attrs(style.strikethrough)),
        applyIfHas(props.underline, stylex.attrs(style.underline)),
        __style.text
      )}
      style={{
        '--text-color': props.color,
        '--text-bgColor': props.bgColor,
      }}
    >
      {props.text}
    </div>
  )
}