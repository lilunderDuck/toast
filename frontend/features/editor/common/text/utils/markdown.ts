import * as _ from "@m2d/mdast"
import { fromMarkdown } from "mdast-util-from-markdown"
import remarkParse from 'remark-parse'
import remarkDirective from 'remark-directive'
import { unified } from "unified"

export function getMarkdownAst(content: string) {
  return fromMarkdown(content)
}

export const EMOJI_SYNTAX_REGEX = /(?<!\\)(:\S+:)/gm
export function splitTexts(content: string) {
  return content.split(EMOJI_SYNTAX_REGEX)
}

export function createProcessor() {
  return unified()
    // .use(remarkStringify)
    .use(remarkDirective)
    .use(remarkParse)
    // .use(remarkEmoji)
  // ...
}