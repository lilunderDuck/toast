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
  bgColor?: string
  // ...
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number
  // ...
  border?: number
  borderStyle?: string
  borderColor?: string
  borderRadius?: number
}

export type TextData = TextOption | TextDataAttribute