import { For, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import "./Menu.css"
// ...
import { getBlocksFloatingMenuOptions, useEditorContext } from "~/features/editor/provider"
// ...
import { MenuItem } from "./MenuItem"
import { Label } from "~/components"

const style = stylex.create({
  menu: {
    width: "14.5rem",
    fontSize: 14,
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
    padding: 5
  },
  menu__seperator: {
    marginBottom: 2
  },
  menu__seperatorText: {
    fontSize: 13
  },
  menu__seperatorLine: {
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
        {(it, index) => {
          switch (it.type$) {
            case FloatingMenuType.ITEM: return <MenuItem {...it} />
            case FloatingMenuType.LABEL: return (
              <section {...stylex.attrs(style.menu__seperator)}>
                <Show when={index() >= 1}>
                  <div {...stylex.attrs(style.menu__seperatorLine)} />
                </Show>
                <Label>
                  {it.label$}
                </Label>
              </section>
            )
            default:
              console.error("Unknown floating menu type:", it.type$)
              return
          }
        }}
      </For>
    </div>
  )
}