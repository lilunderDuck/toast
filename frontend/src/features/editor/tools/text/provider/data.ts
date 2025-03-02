export const enum SubOrSupscript {
  none,
  subscript,
  superscript
}

export const enum TextDataAttribute {
  newLine
}

export type TextFormatting = Partial<{
  pad: number
  border: number
  borderStyle: string
  borderRadius: number
  borderColor: string
}>

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
  top: TextFormatting
  bottom: TextFormatting
  left: TextFormatting
  right: TextFormatting
}

export type TextData = TextOption | TextDataAttribute