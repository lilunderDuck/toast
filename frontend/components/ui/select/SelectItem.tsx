import { type PolymorphicProps } from "@kobalte/core/polymorphic"
import { Item, ItemIndicator, ItemLabel, type SelectItemProps } from "@kobalte/core/select"
import stylex from "@stylexjs/stylex"
import { splitProps, type ParentProps, type ValidComponent } from "solid-js"
import { macro_mergeClassnames } from "macro-def"

const style = stylex.create({
  item: {
    display: "flex",
    position: "relative",
    paddingTop: "0.375rem",
    paddingBottom: "0.375rem",
    paddingLeft: "0.5rem",
    paddingRight: "2rem",
    marginTop: 0,
    alignItems: "center",
    borderRadius: "0.125rem",
    outlineStyle: "none",
    width: "100%",
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
    cursor: "default",
    userSelect: "none",
    ':hover': {
      backgroundColor: 'var(--gray4)'
    }
  },
  itemIndicator: {
    display: "flex",
    position: "absolute",
    right: "0.5rem",
    justifyContent: "center",
    alignItems: "center",
  },
  ItemIndicator__icon: {
    width: "1rem",
    height: "1rem"
  }
})

export interface ISelectItemProps<
  T extends ValidComponent = "li"
> extends SelectItemProps<T>, ParentProps {
  class?: string | undefined
}

export const SelectItem = <T extends ValidComponent = "li">(
  props: PolymorphicProps<T, ISelectItemProps<T>>,
) => {
  const [local, others] = splitProps(props as ISelectItemProps, [
    "class",
    "children",
  ])
  
  return (
    <Item
      {...others}
      class={macro_mergeClassnames(local, stylex.attrs(style.item))}
    >
      <ItemIndicator {...stylex.attrs(style.itemIndicator)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          {...stylex.attrs(style.ItemIndicator__icon)}
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M5 12l5 5l10 -10" />
        </svg>
      </ItemIndicator>
      <ItemLabel>
        {local.children}
      </ItemLabel>
    </Item>
  )
}