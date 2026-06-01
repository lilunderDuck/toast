import { css } from "molcss"
// ...
import type { HTMLAttributes } from "~/utils"

const subSetting = css`
  padding-left: 15px;
  padding-block: 5px;
  margin-top: 5px;
  border-left: 2px solid var(--crust0);
`

export function SubSetting(props: HTMLAttributes<"div">) {
  return (
    <div 
      {...props}
      class={`${subSetting} ${props.class ?? ""}`}
    />
  )
}