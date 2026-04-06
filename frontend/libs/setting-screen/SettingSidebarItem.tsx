import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type ISettingConfig, useSettingContext } from "./SettingProvider"

const style = stylex.create({
  item: {
    marginBottom: 20
  },
  item__label: {
    marginBottom: 5,
    paddingInline: 9,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: "var(--surface1)",
    display: "block",
    color: "var(--subtext0)",
    fontSize: 14,
    height: "100%"
  },
  item__button: {
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    gap: 10,
    color: "var(--subtext0)",
    transition: "0.15s ease-out",
    backgroundColor: "transparent",
    textAlign: "left",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ":hover": {
      color: "var(--text)",
      backgroundColor: "var(--surface0)",
    }
  }
})

export function SettingSidebarItem(props: ISettingConfig) {
  const { setCurrentPage$ } = useSettingContext()

  return (
    <section {...stylex.attrs(style.item)}>
      <label {...stylex.attrs(style.item__label)}>
        {props.label$}
      </label>
      <For each={props.items$}>
        {item => (
          <button
            onClick={() => setCurrentPage$(item.pageId$)}
            {...stylex.attrs(style.item__button)}
          >
            <item.icon$ />
            {item.name$}
          </button>
        )}
      </For>
    </section>
  )
}