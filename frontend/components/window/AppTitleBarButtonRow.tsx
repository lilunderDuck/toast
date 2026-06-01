import __style from "./AppTitleBar.module.css"
import minimizeIcon from "~/assets/icons/min-w-10.png"
import maximizeIcon from "~/assets/icons/max-w-10.png"
import restoreIcon from "~/assets/icons/restore-w-10.png"
import closeIcon from "~/assets/icons/close-w-20.png"
// ...
import { WindowFullscreen, WindowMinimise, WindowUnfullscreen } from "~/wailsjs/runtime/runtime"
import { WindowClose } from "~/wailsjs/go/backend/App"
import { useToggle } from "~/hooks"
// ...
import { css } from "molcss"

const titleBar = css`
  display: flex;
  align-items: center;
  height: var(--title-bar-thiccness);
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
  user-select: none;
`

const titleBar__button = css`
  outline: none;
  background-color: transparent;
  width: var(--title-bar-thiccness);
  height: var(--title-bar-thiccness);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--subtext0);
  border-radius: 0 !important;
`

const titleBar__otherButton = css`
  padding-inline: var(--title-bar-button-padding);
  transition: 0.15s ease-out;
  &:hover {
    background-color: var(--surface0);
  }
`

const titleBar__closeButton = css`
  padding-inline: var(--title-bar-button-padding);
  transition: 0.15s ease-out;
  &:hover {
    background-color: #ff4747;
  }
`

export function AppTitleBarButton() {
  const [isFullscreen, toggleFullscreen] = useToggle()

  return (
    <div class={titleBar} id={__style.buttonRow}>
      <div class={titleBar__otherButton}>
        <button 
          class={titleBar__button}
          onClick={WindowMinimise}
        >
          <img class="icon" src={minimizeIcon} draggable="false" />
        </button>
      </div>
      <div class={titleBar__otherButton}>
        <button
          class={titleBar__button}
          onClick={() => {
            toggleFullscreen()
            isFullscreen() ? WindowFullscreen() : WindowUnfullscreen()
          }}
        >
          <img class="icon" src={isFullscreen() ? restoreIcon : maximizeIcon} draggable="false" />
        </button>
      </div>
      <div class={titleBar__closeButton}>
        <button 
          class={titleBar__button}
          onClick={WindowClose}
        >
          <img class="icon" src={closeIcon} draggable="false" />
        </button>
      </div>
    </div>
  )
}