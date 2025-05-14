import { fromMarkdown } from "mdast-util-from-markdown"
// ...
import __style from "./TextRenderer.module.css"
// ...
import { TextOption } from "./provider"
import { MarkdownText } from "./components"
import { getMarkdownAst } from "./utils"

// I have absolutely no idea
export default function TextRenderer(props: TextOption) {
  const getText = () => props.text
  const getTextColor = () => props.color ?? ''
  const getBackgroundColor = () => props.bgColor ?? ''
  return (
    <div
      class={__style.text}
      style={{
        color: getTextColor(),
        "background-color": getBackgroundColor(),
      }}
    >
      <MarkdownText markdownData$={getMarkdownAst(props.text)} />
    </div>
  )
}