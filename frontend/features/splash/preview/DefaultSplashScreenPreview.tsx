import { css } from "molcss"
import toastIcon from "~/assets/toast.jpg"
// ...
import { FourDotsSpinningLoader } from "~/components"

const screen = css`
  background-color: var(--crust);
  width: 100%;
  height: 85%;
  position: relative;
`

const screen__iconWrap = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  position: absolute;
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
  margin: 10px;
`

export default function DefaultSplashScreen() {
  return (
    <div class={screen}>
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