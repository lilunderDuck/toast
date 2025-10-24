import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from "~/styles/scrollbar.module.css"
// ...
import { macro_mergeClassnames } from "macro-def"
// ...
import { useEditorContext } from "../../provider"

interface IFloatingMenuProps {
  toggleHeading$: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean
  class?: string
  ref?: HTMLAttributes<"div">["ref"]
}

const style = stylex.create({
  menu: {
    paddingInline: 5,
    paddingBlock: 10,
    borderRadius: 6,
    width: "14rem",
    height: "10rem",
    userSelect: "none",
    display: "flex",
    backgroundColor: "var(--gray4)",
    flexFlow: "column",
    gap: 3,
  },
  menu__option: {
    color: "var(--gray11)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    ":hover": {
      backgroundColor: "var(--gray7)",
      color: "var(--gray12)",
    }
  },
  menu__name: {
    fontSize: 15
  }
})

export function FloatingMenu(props: IFloatingMenuProps) {
  const { menus$ } = useEditorContext()

  return (
    <div 
      class={macro_mergeClassnames(
        stylex.attrs(style.menu),
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar,
        props
      )} 
      ref={props.ref}
    >
      <For each={menus$.floatingMenuOptions$()}>
        {it => (
          <button onClick={it.run$} {...stylex.attrs(style.menu__option)} tabindex={1}>
            <it.icon$ />
            <span {...stylex.attrs(style.menu__name)}>
              {it.name$}
            </span>
          </button>
        )}
      </For>
    </div>
  )
}