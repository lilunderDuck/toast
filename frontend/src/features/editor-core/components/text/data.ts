export const enum SubOrSupscript {
  none,
  subscript,
  superscript
}

export type TextData = {
  text: string
  // ...
  bold?: boolean
  italic?: boolean
  strikethrough?: boolean
  underline?: boolean
  // ...
  subOrSupscript?: SubOrSupscript
  // ...
  color?: string
  link?: string
  bgColor?: string
}