import { Show } from "solid-js"
import { Portal } from "solid-js/web"
// ...
import stylex from "@stylexjs/stylex"
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

const style = stylex.create({
  titleBar: {
    display: "flex",
    alignItems: "center",
    height: "var(--title-bar-thiccness)",
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 1000
  },
  titleBar__button: {
    outline: 'none',
    backgroundColor: 'transparent',
    width: 'var(--title-bar-thiccness)',
    height: 'var(--title-bar-thiccness)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--gray11)',
    borderRadius: '0 !important',
  },
  titleBar__otherButton: {
    paddingInline: 'var(--title-bar-button-padding)',
    ":hover": {
      backgroundColor: "var(--gray4)"
    }
  },
  titleBar__closeButton: {
    paddingInline: 'var(--title-bar-button-padding)',
    ":hover": {
      backgroundColor: "var(--red9)"
    }
  }
})

export function AppTitleBarButton() {
  const [isFullscreen, toggleFullscreen] = useToggle()

  return (
    <Portal>
      <div {...stylex.attrs(style.titleBar)} id={__style.buttonRow}>
        <div {...stylex.attrs(style.titleBar__otherButton)}>
          <button 
            {...stylex.attrs(style.titleBar__button)}
            onClick={WindowMinimise}
          >
            <img class="icon" src={minimizeIcon} draggable="false" />
          </button>
        </div>
        <div {...stylex.attrs(style.titleBar__otherButton)}>
          <button
            {...stylex.attrs(style.titleBar__button)}
            onClick={() => {
              toggleFullscreen()
              isFullscreen() ? WindowFullscreen() : WindowUnfullscreen()
            }}
          >
            <Show when={isFullscreen()} fallback={
              <img class="icon" src={maximizeIcon} draggable="false" />
            }>
              <img class="icon" src={restoreIcon} draggable="false" />
            </Show>
          </button>
        </div>
        <div {...stylex.attrs(style.titleBar__closeButton)}>
          <button 
            {...stylex.attrs(style.titleBar__button)}
            onClick={WindowClose}
          >
            <img class="icon" src={closeIcon} draggable="false" />
          </button>
        </div>
      </div>
    </Portal>
  )
}