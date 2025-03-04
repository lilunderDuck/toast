import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"

const style = stylex.create({
  $input: {
    paddingInline: 10,
    paddingBlock: 6,
    borderRadius: 6,
    transition: '0.25s ease-out',
    outline: 'none',
    backgroundColor: 'var(--gray4)',
    width: '100%',
  }
})

export function Input(props: HTMLAttributes<"input">) {
  // because edge is just ignore the damn autocomplete attribute, so we have...
  const disableAutocompleteInEdgeIfNeeds = () => props.autocomplete === 'off' ? {
    'aria-autocomplete': "none"
  } as const : {}

  return (
    <input 
      {...props} 
      {...disableAutocompleteInEdgeIfNeeds()}
      class={mergeClassname(
        props,
        stylex.attrs(style.$input)
      )} 
    />
  )
}