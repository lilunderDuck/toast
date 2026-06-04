import { css } from "molcss"
// ...
import { BsCheck2Square } from "solid-icons/bs"
// ...
import type { Toast } from "~/components/util"

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

interface IGroupEditedToastProps extends Toast {
  name$: string
}

export function GroupEditedToast(props: IGroupEditedToastProps) {
  return (
    <div class={toast}>
      <div class={toast__title}>
        <BsCheck2Square />
        <h4>Journal group edited</h4>
      </div>
      <div class={toast__description}>
        Successfully updated <code>{props.name$}</code>
      </div>
    </div>
  )
}