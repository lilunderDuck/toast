import { splitProps, type ValidComponent } from "solid-js"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Content, Listbox, Portal, type SelectContentProps } from "@kobalte/core/select"
// ...
import "./SelectContent.css"
import { css } from "molcss"

const content = css`
  overflow: hidden;
  position: relative;
  z-index: 50;
  border-radius: 0.375rem;
  border-width: 1;
  background-color: var(--surface0);
`

export interface ISelectContentProps<
  T extends ValidComponent = "div"
> extends SelectContentProps<T> {
  class?: string | undefined
}

export function SelectContent<T extends ValidComponent = "div">(
  props: PolymorphicProps<T, ISelectContentProps<T>>,
) {
  const [local, others] = splitProps(props as ISelectContentProps, ["class"])
  return (
    <Portal>
      <Content
        class={`${content} select__content ${local.class ?? ""}`}
        {...others}
      >
        <Listbox />
      </Content>
    </Portal>
  )
}