import { Portal } from "solid-js/web"
import { onMount } from "solid-js"
import { BsAppIndicator, BsDash, BsX } from "solid-icons/bs"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./Titlebar.module.css"
// ...
import { FlexCenterY, Spacer } from "../ui"
import { TitlebarButton } from "./TitlebarButton"

const style = stylex.create({
  titleBar: {
    height: `var(--titlebar-thickness)`,
    width: '100%',
    paddingLeft: 15,
    userSelect: 'none'
  }
})

export function Titlebar() {
  let portalRef!: Ref<"div">
  onMount(() => {
    portalRef.id = __style.titleBar
  })

  return (
    <Portal mount={document.getElementById('title-bar')!} ref={portalRef}>
      <FlexCenterY {...stylex.attrs(style.titleBar)}>
        <span>Burned toast</span>
        <Spacer />
        <FlexCenterY id={__style.buttonRow}>
          <TitlebarButton onClick={WindowMinimise}>
            <BsDash />
          </TitlebarButton>
          {/* <TitlebarButton onClick={async() => {
            if (await WindowIsMaximised()) {
              WindowUnmaximise()
            } else {
              WindowMaximise()
            }
          }}>
            <BsAppIndicator />
          </TitlebarButton> */}
          <TitlebarButton onClick={Quit}>
            <BsX />
          </TitlebarButton>
        </FlexCenterY>
      </FlexCenterY>
    </Portal>
  )
}
