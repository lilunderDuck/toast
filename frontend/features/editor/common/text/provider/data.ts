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

export const enum TextType {
  text,
  newLine
}

export type TextOption = {
  type: TextType.text
  text: string
  // ...
  subOrSupscript?: SubOrSupscript
  // ...
  color?: string
  bgColor?: string
  // ...
  top?: TextFormatting
  bottom?: TextFormatting
  left?: TextFormatting
  right?: TextFormatting
}

export type TextData = 
  TextOption |
  { type: TextType.newLine }

export type InputTextData = {
  text: string
}

export const DEFAULT_TEXT_DATA: TextOption = { type: TextType.text, text: '' }
export const DEFAULT_NEWLINE_DATA =          { type: TextType.newLine }