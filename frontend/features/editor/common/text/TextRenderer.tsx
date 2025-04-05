import Markdown from "solid-marked/component"
// ...
import __style from "./TextRenderer.module.css"
// ...
import { mergeClassname, StylexStylesAttribute } from "~/utils"
// ...
import { TextOption } from "./provider"
import { Dynamic } from "solid-js/web"

// I have absolutely no idea
export default function TextRenderer(props: TextOption) {
  const applyIfHas = (something: any, value: StylexStylesAttribute) => something ? value : ''
  const getText = () => props.text
  const getTextColor = () => props.color ?? ''
  const getBackgroundColor = () => props.bgColor ?? ''

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
              color: getTextColor(),
              "background-color": getBackgroundColor(),
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