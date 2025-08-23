import { BsDash, BsX } from "solid-icons/bs"
import { FaRegularWindowMaximize, FaRegularWindowRestore } from "solid-icons/fa"
// ...
import __style from "./AppTitleBar.module.css"
import stylex from "@stylexjs/stylex"
import { useAppTitleBarContext } from "./AppTitleBarProvider"
import { Show } from "solid-js"
// ...

const style = stylex.create({
  titleBar: {
    display: "flex",
    alignItems: "center",
    height: 35,
    gap: 5
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
  const { isFullscreen$, hideWindow$, toggleMaximizeWindow$, close$ } = useAppTitleBarContext()

  return (
    <div {...stylex.attrs(style.titleBar)}>
      <button onClick={hideWindow$}>
        <BsDash />
      </button>
      <button onClick={toggleMaximizeWindow$}>
        <Show when={isFullscreen$()} fallback={
          <FaRegularWindowMaximize />
        }>
          <FaRegularWindowRestore />
        </Show>
      </button>
      <button onClick={close$}>
        <BsX />
      </button>
    </div>
  )
}