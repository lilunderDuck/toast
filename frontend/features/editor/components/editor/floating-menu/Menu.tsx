import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { getBlocksFloatingMenuOptions, useEditorContext } from "~/features/editor/provider"
// ...
import { MenuItem } from "./MenuItem"

const style = stylex.create({
  menu: {
    width: "14.5rem",
    fontSize: 14,
    backgroundColor: "var(--gray3)",
    borderRadius: 6
  },
  menu__seperator: {
    width: "100%",
    height: 2,
    backgroundColor: "var(--gray7)",
    marginTop: 10,
    marginBottom: 5
  }
})

interface IFloatingMenProps {
  ref: Ref<"div">
}

export function FloatingMenu(props: IFloatingMenProps) {
  const { editor$ } = useEditorContext()

  return (
    <div {...stylex.attrs(style.menu)} ref={props.ref}>
      <For each={getBlocksFloatingMenuOptions(editor$)}>
        {it => {
          if (it === FLOATING_MENU_SEPERATOR) return (
            <div {...stylex.attrs(style.menu__seperator)} />
          )

          return <MenuItem {...it} />
        }}
      </For>
    </div>
  )
}