import Markdown from "solid-marked/component"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TextRenderer.module.css"
// ...
import { mergeClassname, StylexStylesAttribute } from "~/utils"
// ...
import { TextOption, TextData } from "./provider"
import { Dynamic } from "solid-js/web"

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
export default function TextRenderer(props: TextOption) {
  const applyIfHas = (something: any, value: StylexStylesAttribute) => something ? value : ''
  const getText = () => props.text

  return (
    <Markdown
      builtins={{
        InlineCode(props) {
          return <code>{props.children}</code>
        },
        Strong(props) {
          return <b>{props.children}</b>
        },
        Root(rootProps) {
          return (
            <div class={__style.text} style={{
              '--text-color': props.color,
              '--text-bgColor': props.bgColor,
            }}>{rootProps.children}</div>
          )
        },
        Blockquote(props) {
          return (
            <blockquote>
              {props.children}
            </blockquote>
          )
        },
        Emphasis(props) {
          return <i>{props.children}</i>
        },
        Paragraph(props) {
          return <>{props.children}</>
        },
        Link(props) {
          return <a href={props.url}>{props.children}</a>
        },
        Heading(props) {
          return (
            <Dynamic component={`h${props.depth}`} id={props.id}>
              {props.children}
            </Dynamic>
          )
        }
      }}
    >
      {getText()}
    </Markdown>
  )
}