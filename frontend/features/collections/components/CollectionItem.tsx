import { useNavigate } from "@solidjs/router"
import { DEBUG_INFO_LABEL, DEBUG_WARN_LABEL } from "macro-def"
// ...
import { css } from "molcss"
// ...
import { Tooltip } from "~/components"
// ...
import { showCollectionNotAvailableToast } from "./toast"

const item = css`
  width: 9rem;
  border-radius: 6px;
  outline: 4px solid transparent;
  text-align: left;
  padding: 0;
  margin: 0;
  background-color: var(--surface0);
  &:hover {
    outline-color: var(--sapphire);
  }
`

const item__notAvailable = css`
  opacity: 0.5;
`

const item__name = css`
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding-inline: 5px;
  padding-block: 8px;
`

const item__backgroundWrap = css`
  width: 9rem;
  height: 9rem;
  background: center center no-repeat var(--icon-url);
  background-size: cover;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`

interface ICollectionItemProps {
  iconUrl$: string
  href$: string
  tooltipLabel$: string
  name$: string
  isAvailable$?: boolean
}

export function CollectionItem(props: ICollectionItemProps) {
  const redirect = useNavigate()

  const redirectIfCan = () => {
    if (props.isAvailable$) {
      DEBUG_INFO_LABEL("home", `fast redirect to:`, props.href$)
      redirect(props.href$)
      return
    }

    DEBUG_WARN_LABEL("home", `refused to redirect, collection "${props.name$}" is not available now.\n\nnote: Did you forget to set the isAvailable$ props? if so, don't forget to put isAvailable$ into <CollectionItem /> component.`)
    showCollectionNotAvailableToast()
  }

  return (
    <Tooltip label$={props.tooltipLabel$}>
      <button
        class={`${item} ${!props.isAvailable$ ? item__notAvailable : ""}`}
        style={`--icon-url:url("${props.iconUrl$}")`}
        onClick={redirectIfCan}
        aria-disabled={!props.isAvailable$}
      >
        <div class={item__backgroundWrap} />
        <div class={item__name}>
          {props.name$}
        </div>
      </button>
    </Tooltip>
  )
}