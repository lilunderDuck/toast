import { For } from "solid-js"
// ...
// ...
import { type ISettingConfig } from "../provider/SettingProvider"
import { css } from "molcss"

const item = css`
  margin-bottom: 20px;
`

const item__label = css`
  margin-bottom: 5px;
  padding-inline: 9px;
  padding-block: 2px;
  border-radius: 6px;
  background-color: var(--surface0);
  display: block;
  color: var(--subtext0);
  font-size: 14px;
  height: 100%;
`

const item__button = css`
  padding-inline: 10px;
  padding-block: 5px;
  border-radius: 6px;
  gap: 10px;
  color: var(--subtext0);
  transition: 0.15s ease-out;
  background-color: transparent;
  text-align: left;
  display: flex;
  align-items: center;
  width: 100%;
`

const item__buttonInactive = css`
  &:hover {
    color: var(--text);
    background-color: var(--surface0);
  }
`

const item__buttonActive = css`
  color: var(--crust);
  background-color: var(--blue);
`

interface ISettingSidebarItemProps extends ISettingConfig {
  onClick$(item: ISettingConfig["items$"][0]): void
  isCurrentPage$(item: ISettingConfig["items$"][0]): boolean
}

export function SettingSidebarItem(props: ISettingSidebarItemProps) {
  return (
    <section class={item}>
      <label class={item__label}>
        {props.label$}
      </label>
      <For each={props.items$}>
        {item => (
          <button
            onClick={() => props.onClick$(item)}
            class={`${item__button} ${props.isCurrentPage$(item) ? item__buttonActive : item__buttonInactive}`}
          >
            <item.icon$ />
            {item.name$}
          </button>
        )}
      </For>
    </section>
  )
}