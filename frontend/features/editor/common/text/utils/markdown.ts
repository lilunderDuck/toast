import * as _ from "@m2d/mdast"
import { fromMarkdown } from "mdast-util-from-markdown"

export function getMarkdownAst(content: string) {
  return fromMarkdown(content)
}

export const EMOJI_SYNTAX_REGEX = /(?<!\\)(:\S+:)/gm
export function splitTexts(content: string) {
  return content.split(EMOJI_SYNTAX_REGEX)
}