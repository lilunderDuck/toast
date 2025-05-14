import type { Root, RootContent } from "mdast"
import { For } from "solid-js"
import { EMOJI_SYNTAX_REGEX, splitTexts } from "../utils"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  emoji: {
    width: 20,
    height: 20,
    display: 'inline'
  }
})

interface IMarkdownTextProps {
  markdownData$: Root | RootContent[]
}

export function MarkdownText(props: IMarkdownTextProps) {
  const markdownAst = Array.isArray(props.markdownData$) ? 
    props.markdownData$ : 
    props.markdownData$.children
  // ...

  return (
    <For each={markdownAst}>
      {it => <MarkdownRenderer data$={it} />}
    </For>
  )
}

function MarkdownRenderer(props: { data$: RootContent }) {
  const markdownContent = props.data$
  // @ts-ignore
  const RecursiveRender = () => <MarkdownText markdownData$={markdownContent.children} />
  
  switch (markdownContent.type) {
    case "paragraph": return <RecursiveRender />
    case "strong": return (
      <b>
        <RecursiveRender />
      </b>
    )
    case "inlineCode": return (
      <code>
        <RecursiveRender />
      </code>
    )
    case "emphasis": return (
      <i>
        <RecursiveRender />
      </i>
    )
    case "link": return (
      <a href={markdownContent.url}>
        <RecursiveRender />
      </a>
    )
    case "text": 
      return <TextRenderer rawText$={markdownContent.value} />
    default: // not supported
      console.log(markdownContent)
      return <></>
  }
}

function TextRenderer(props: { rawText$: string }) {
  if (EMOJI_SYNTAX_REGEX.test(props.rawText$)) { // does include emoji in it
    return (
      <For each={splitTexts(props.rawText$)}>
        {it => {
          if (it.includes(":")) {
            const emojiName = it.replaceAll(":", "")
            return <img src={`/emoji/${emojiName}.png`} {...stylex.attrs(style.emoji)} />
          }

          return it // everything else
        }}
      </For>
    )
  } 

  return props.rawText$
}