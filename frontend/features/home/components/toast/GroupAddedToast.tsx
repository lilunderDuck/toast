import { BsCheck2Square } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
// ...
import type { Toast } from "~/libs/solid-toast/util"
import { css } from "molcss"

const toast = css`
  background-color: "var(--surface0)";
  padding-block: 5px;
  padding-inline: 10px;
  width: 18rem;
`

const toast__title = css`
  display: flex;
  align-items: center;
  gap: 10;
  margin-bottom: 5;
`

const toast__description = css`
  margin-left: 25px;
  font-size: 13px;
  color: var(--subtext0);
`

interface IGroupAddedToastProps extends Toast {
  name$: string
}

export function GroupAddedToast(props: IGroupAddedToastProps) {
  return (
    <div class={toast}>
      <div class={toast__title}>
        <BsCheck2Square />
        <h4>Journal group added</h4>
      </div>
      <div class={toast__description}>
        Added new group <code>{props.name$}</code>
      </div>
    </div>
  )
}