import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import { BsCheck } from "solid-icons/bs"
import { macro_mergeClassnames } from "macro-def"
import { Root, Input, Control, Indicator, type CheckboxRootProps } from "@kobalte/core/checkbox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  checkbox: {
    display: "flex",
    marginLeft: "0.5rem"
  },
  checkboxControl: {
    width: 20,
    height: 20,
    borderRadius: "0.125rem",
    backgroundColor: 'var(--gray4)',
    border: '1px solid var(--gray3)',
    cursor: 'pointer',
    display: "flex",
    placeItems: 'center',
    borderWidth: "1px"
  }
})

interface ICheckboxRootProps<T extends ValidComponent = "div"> extends CheckboxRootProps<T> {
  class?: string | undefined
}
 
export function Checkbox<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ICheckboxRootProps<T>>
) {
  const [local, others] = splitProps(props as ICheckboxRootProps, ["class"])
  return (
    <Root {...others} class={macro_mergeClassnames(local, stylex.attrs(style.checkbox))}>
      <Input class="peer" />
      <Control {...stylex.attrs(style.checkboxControl)}>
        <Indicator>
          <BsCheck />
        </Indicator>
      </Control>
    </Root>
  )
}