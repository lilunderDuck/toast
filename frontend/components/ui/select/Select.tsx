import { 
  HiddenSelect,
  Root,
  Value,
  type SelectRootProps
} from "@kobalte/core/select"
import __style from "./Select.module.css"
import type { ParentProps, ValidComponent } from "solid-js"
import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  this: {
    backgroundColor: 'var(--gray4)',
    borderRadius: 6
  }
})

// Forgot to add these things
export const SelectValue = Value
export const SelectHiddenSelect = HiddenSelect

export function Select<
  Option, 
  OptGroup = never, 
  T extends ValidComponent | HTMLElement = HTMLElement
>(props: ParentProps<SelectRootProps<Option, OptGroup, T>>) {
  return (
    <Root {...props} id={__style.select} class={macro_mergeClassnames(props, stylex.attrs(style.this))} />
  )
}