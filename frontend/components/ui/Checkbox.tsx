import { DEBUG_ASSERT } from "macro-def"
import { css } from "molcss"
import type { HTMLAttributes } from "~/utils"

// Adapted from: https://stackblitz.com/edit/custom-checkbox-css?file=style.css

const checkbox__input = css`
  position: relative;
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  appearance: none;
  border: none;
  cursor: pointer;
  background-color: transparent;
  
  &:checked:before {
    background-color: var(--blue);
    border: 2px solid var(--blue);
  }
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 2px solid var(--surface2);
    border-radius: 6px;
    background-color: transparent;
  }

  &:checked:after {
    width: 0.75rem;
    height: 0.375rem;
    border-color: var(--crust);
  }

  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    transform: rotate(-45deg);
    transform-origin: 1.125rem -0.0625rem;
    border-bottom: 0.125rem solid transparent;
    border-left: 0.125rem solid transparent;
  }
`

interface ICheckboxProps extends Omit<HTMLAttributes<"input">, "value" | "onChange"> {
  value?: boolean
  onChange?: (state: boolean) => any
}

export function Checkbox(props: ICheckboxProps) {
  return (
    <input
      {...props}
      type="checkbox"
      class={checkbox__input}
      value={`${props.value ?? false}`}
      onChange={(changeEvent) => {
        const newValue = changeEvent.currentTarget.value
        DEBUG_ASSERT(
          newValue === "true" ||
          newValue === "false",
          `Expected stringified boolean, got: "${newValue}"`
        )

        props.onChange?.(JSON.parse(newValue) as boolean)
      }}
    />
  )
}