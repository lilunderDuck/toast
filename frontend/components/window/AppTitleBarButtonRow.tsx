import { Show } from "solid-js"
import { BsDash, BsX } from "solid-icons/bs"
import { FaRegularWindowMaximize, FaRegularWindowRestore } from "solid-icons/fa"
import { Portal } from "solid-js/web"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./AppTitleBar.module.css"
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
    gap: 5,
    position: "fixed",
    right: 0,
    top: 0,
    zIndex: 1000
  },
  titleBar__otherButton: {
    ":hover": {
      backgroundColor: "var(--gray4)"
    }
  },
  titleBar__closeButton: {
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
        <button onClick={WindowMinimise}>
          <BsDash />
        </button>
        <button onClick={() => {
          toggleFullscreen()
          isFullscreen() ? WindowFullscreen() : WindowUnfullscreen()
        }}>
          <Show when={isFullscreen()} fallback={
            <FaRegularWindowMaximize />
          }>
            <FaRegularWindowRestore />
          </Show>
        </button>
        <button onClick={WindowClose}>
          <BsX />
        </button>
      </div>
    </Portal>
  )
}