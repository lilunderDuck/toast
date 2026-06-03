import { 
  HiddenSelect,
  Root,
  Value,
  type SelectRootProps
} from "@kobalte/core/select"
import "./Select.css"
// ...
import type { ParentProps, ValidComponent } from "solid-js"
// ...
import { css } from "molcss"

// Forgot to add these things
export const SelectValue = Value
export const SelectHiddenSelect = HiddenSelect

export function Select<
  Option, 
  OptGroup = never, 
  T extends ValidComponent | HTMLElement = HTMLElement
>(props: ParentProps<SelectRootProps<Option, OptGroup, T>>) {
  return (
    <Root 
      {...props} 
      class={css`
        background-color: var(--surface0);
        border-radius: 6px;
      `}
      id="select" 
    />
  )
}