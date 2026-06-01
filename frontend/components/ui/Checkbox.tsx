import type { ValidComponent } from "solid-js"
import { splitProps } from "solid-js"
import { BsCheck } from "solid-icons/bs"
// ...
import { Root, Input, Control, Indicator, type CheckboxRootProps } from "@kobalte/core/checkbox"
import type { PolymorphicProps } from "@kobalte/core/polymorphic"
// ...
import { css } from "molcss"

const checkbox = css`
  display: flex;
  margin-left: 0.5rem;
`

const checkbox__control = css`
  width: 20px;
  height: 20px;
  border-radius: 0.125rem;
  background-color: var(--surface0);
  border: 1px solid var(--base);
  cursor: pointer;
  display: flex;
  place-items: center;
  border-width: 1px;
`

interface ICheckboxRootProps<T extends ValidComponent = "div"> extends CheckboxRootProps<T> {
  class?: string | undefined
}

export function Checkbox<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ICheckboxRootProps<T>>
) {
  const [local, others] = splitProps(props as ICheckboxRootProps, ["class"])
  return (
    <Root {...others} class={`${checkbox} ${local.class ?? ""}`}>
      <Input class="peer" />
      <Control class={checkbox__control}>
        <Indicator>
          <BsCheck />
        </Indicator>
      </Control>
    </Root>
  )
}