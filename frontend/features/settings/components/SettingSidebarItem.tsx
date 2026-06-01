import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { type ISettingConfig } from "../provider/SettingProvider"
import { CLS } from "macro-def"

const style = stylex.create({
  item: {
    marginBottom: 20
  },
  item__label: {
    marginBottom: 5,
    paddingInline: 9,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: "var(--surface0)",
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
    alignItems: "center",
    width: "100%",
  },
  item__buttonInactive: {
    ":hover": {
      color: "var(--text)",
      backgroundColor: "var(--surface0)",
    }
  },
  item__buttonActive: {
    color: "var(--text)",
    backgroundColor: "var(--blue)",
  }
})

interface ISettingSidebarItemProps extends ISettingConfig {
  onClick$(item: ISettingConfig["items$"][0]): void
  isCurrentPage$(item: ISettingConfig["items$"][0]): boolean
}

export function SettingSidebarItem(props: ISettingSidebarItemProps) {
  return (
    <section {...stylex.attrs(style.item)}>
      <label {...stylex.attrs(style.item__label)}>
        {props.label$}
      </label>
      <For each={props.items$}>
        {item => (
          <button
            onClick={() => props.onClick$(item)}
            class={`${CLS(style.item__button)} ${props.isCurrentPage$(item) ? CLS(style.item__buttonActive) : CLS(style.item__buttonInactive)}`}
          >
            <item.icon$ />
            {item.name$}
          </button>
        )}
      </For>
    </section>
  )
}