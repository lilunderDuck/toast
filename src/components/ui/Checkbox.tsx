import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
 
import * as CheckboxPrimitive from "@kobalte/core/checkbox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
 
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "../../utils"
import { BsCheck } from "solid-icons/bs"
 
type CheckboxRootProps<T extends ValidComponent = "div"> =
  CheckboxPrimitive.CheckboxRootProps<T> & { class?: string | undefined }
// 

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
 
const Checkbox = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, CheckboxRootProps<T>>
) => {
  const [local, others] = splitProps(props as CheckboxRootProps, ["class"])
  return (
    <CheckboxPrimitive.Root {...others} class={mergeClassname(local, stylex.attrs(style.checkbox))}>
      <CheckboxPrimitive.Input class="peer" />
      <CheckboxPrimitive.Control {...stylex.attrs(style.checkboxControl)}>
        <CheckboxPrimitive.Indicator>
          <BsCheck />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Control>
    </CheckboxPrimitive.Root>
  )
}
 
export { Checkbox }