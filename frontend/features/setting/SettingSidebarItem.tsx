import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { ISettingConfig, useSettingContext } from "./SettingProvider"

const style = stylex.create({
  settingSection: {
    marginBottom: 20
  },
  label: {
    marginBottom: 5,
    paddingInline: 9,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: "var(--gray5)",
    display: "block",
    color: "var(--gray11)",
    fontSize: 14
  },
  item: {
    paddingInline: 10,
    paddingBlock: 5,
    borderRadius: 6,
    gap: 10,
    color: "var(--gray11)",
    transition: "0.15s ease-out",
    backgroundColor: "transparent",
    textAlign: "left",
    ":hover": {
      color: "var(--gray12)",
      backgroundColor: "var(--gray4)",
    }
  }
})

export function SettingSidebarItem(props: ISettingConfig) {
  const { setCurrentPage$ } = useSettingContext()

  return (
    <section {...stylex.attrs(style.settingSection)}>
      <label {...stylex.attrs(style.label, shorthands.h_full$)}>
        {props.label$}
      </label>
      <For each={props.items$}>
        {item => (
          <button
            onClick={() => setCurrentPage$(item.pageId$)}
            {...stylex.attrs(
              style.item,
              shorthands.w_full$,
              shorthands.flex_y_center$
            )}
          >
            <item.icon$ />
            {item.name$}
          </button>
        )}
      </For>
    </section>
  )
}