import { EditorData } from "../core"

export function getBlocksTextLength(blocks: EditorData["content"]) {
  return blocks
    .filter((it) => 'text' in it.data)
    .reduce((sum, block) => {
      sum += block.data.text.length

      return sum
    }, 0)
  // ...
}

export function getBlocksWordCount(blocks: EditorData["content"]) {
  return blocks
    .filter((it) => 'text' in it.data)
    .reduce((sum, block) => {
      sum += (block.data.text as string).trim().split(' ').length

      return sum
    }, 0)
  // ...
}