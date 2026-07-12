import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const input = css`
  padding-inline: 10px;
  padding-block: 6px;
  border-radius: 6px;
  outline: none;
  background-color: var(--surface0);
  width: 100%;
`

export function Input(props: HTMLAttributes<"input">) {
  // because edge is just ignore the damn autocomplete attribute, so we have...
  const disableAutocompleteInEdgeIfNeeds = () => props.autocomplete === 'off' ? {
    'aria-autocomplete': "none"
  } as const : {}

  return (
    <input 
      {...props} 
      {...disableAutocompleteInEdgeIfNeeds()}
      class={`${input} ${props.class}`} 
    />
  )
}