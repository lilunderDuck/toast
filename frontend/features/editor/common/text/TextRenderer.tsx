import type { Blockquote, Heading, Html, InlineCode, Link, List, ListItem, Parent, Text } from "@m2d/mdast"
import { Dynamic, For } from "solid-js/web"
// ...
import { editorLog } from "~/features/debug"
// ...
import __style from "./TextRenderer.module.css"

interface ITextRendererProps {
  markdownAst: Parent | Parent[]
}

export default function TextRenderer(props: ITextRendererProps) {
  if (Array.isArray(props.markdownAst)) {
    return (
      <For each={props.markdownAst}>
        {it => <Identify markdownAst={it} />}
      </For>
    )
  }

  return (
    <Identify markdownAst={props.markdownAst} />
  )
}

function Identify(props: { markdownAst: Parent }) {
  switch (props.markdownAst.type) {
    case "root":
      return <TextRenderer markdownAst={props.markdownAst.children} />
    case "strong":
      return (
        <b>
          <TextRenderer markdownAst={props.markdownAst.children} />
        </b>
      )
    // case "table":
      // return
    // case "tableRow":
      // return
    // case "tableCell":
      // return
    case "text":
      return (props.markdownAst as unknown as Text).value
    case "thematicBreak":
      return <hr />
    // case "yaml":
      // return
    case "code":
      return
    case "paragraph":
      return (
        <p>
          <TextRenderer markdownAst={props.markdownAst.children} />
        </p>
      )
    case "emphasis":
      return
    case "heading":
      const headingData = props.markdownAst as Heading
      return (
        <Dynamic component={`h${headingData.depth}` as const}>
          <TextRenderer markdownAst={headingData.children} />
        </Dynamic>
      )
    case "html":
      const rawHtml = (props.markdownAst as unknown as Html).value
      return (
        <div innerHTML={rawHtml} />
      )
    case "link":
      const linkData = props.markdownAst as unknown as Link
      return (
        <a href={linkData.url}>
          <TextRenderer markdownAst={linkData.children} />
        </a>
      )
    case "inlineCode":
      return (
        <code>
          {(props.markdownAst as unknown as InlineCode).value}
        </code>
      )
    case "list":
      const listData = props.markdownAst as unknown as List
      const elementToRender = listData.ordered ? "ol" : "ul"
      return (
        <Dynamic component={elementToRender}>
          <TextRenderer markdownAst={listData.children} />
        </Dynamic>
      )
    case "listItem":
      const listItemData = props.markdownAst as unknown as ListItem
      return (
        <li>
          <TextRenderer markdownAst={listItemData.children} />
        </li>
      )
    case "containerDirective":
      break
    case "textDirective":
      break
    case "leafDirective":
      break
    case "blockquote":
      const blockquoteData = props.markdownAst as unknown as Blockquote
      return (
        <blockquote>
          <TextRenderer markdownAst={blockquoteData.children} />
        </blockquote>
      )
  
    default:
      isDevMode && editorLog.warnLabel("text", "[text renderer] case", props.markdownAst.type, "has not been handled.")
      break;
  }
}