export const enum SubOrSupscript {
  none,
  subscript,
  superscript
}

export const enum TextDataAttribute {
  newLine
}

export type TextOption = {
  text: string
  // ...
  subOrSupscript?: SubOrSupscript
  // ...
  color?: string
  link?: string
  bgColor?: string
}

export type TextData = TextOption | TextDataAttribute