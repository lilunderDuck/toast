import { onMount } from "solid-js"
// ...
import { css } from "molcss"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable, FourDotsSpinningLoader } from "~/components"
import { sleep } from "~/utils"
// ...
import { useSplashScreenContext } from "../../provider"

const screen = css`
  background-color: var(--crust);
`

const screen__titleBarDraggable = css`
  position: absolute;
`

const screen__iconWrap = css`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`

const screen__icon = css`
  width: 12rem;
  height: 12rem;
  border-radius: 50%;
  background: center center no-repeat var(--icon);
  background-size: contain;
`

const screen__loader = css`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 10;
`

export default function DefaultSplashScreen() {
  const { progress$, hideScreen$ } = useSplashScreenContext()

  onMount(async() => {
    await sleep(2000)
    hideScreen$()
  })

  return (
    <div 
      class={screen}
      style={`--progress:${progress$()}%`} 
      id="splashScreen"
      data-completed={progress$() === 100}
    >
      <AppTitleBarDraggable class={screen__titleBarDraggable} />
      <div class={screen__iconWrap}>
        <div
          class={screen__icon}
          style={`--icon:url('${toastIcon}')`}
        />
      </div>
      <div class={screen__loader}>
        <FourDotsSpinningLoader />
      </div>
    </div>
  )
}