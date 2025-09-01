import { splitProps, type ValidComponent } from "solid-js"
import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Content, Listbox, Portal, type SelectContentProps } from "@kobalte/core/select"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./SelectContent.module.css"
// ...
import { mergeClassname } from "~/utils"

const style = stylex.create({
  content: {
    overflow: "hidden",
    position: "relative",
    zIndex: 50,
    borderRadius: "0.375rem",
    borderWidth: 1,
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    backgroundColor: 'var(--gray2)',
  }
})

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
        class={mergeClassname(local, stylex.attrs(style.content))}
        id={__style.content}
        {...others}
      >
        <Listbox />
      </Content>
    </Portal>
  )
}