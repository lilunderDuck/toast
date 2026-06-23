import { css } from "molcss"
import "./NeoforgeSpinningFoxIcon.css"
// ...
import fox_spinning_spritesheet from "../../../assets/fox_running.png"

const spinningFox = css`
  width: 256px;
  height: 150px;
  position: absolute;
  bottom: 0;
  right: -30;
  background-image: var(--sprite-url);
  background-repeat: no-repeat;
  background-size: 100% auto;
`

const spinningFox__version = css`
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 5;
`

export function NeoforgeSpinningFoxIcon() {
  return (
    <>
      <div 
        class={`${spinningFox} spinningFox__animation`} 
        style={`--sprite-url:url("${fox_spinning_spritesheet}")`}
      />
      <div class={spinningFox__version}>
        toast_1.0.0 {TOAST_DEBUG ? "DEBUG BUILD" : "RELEASE BUILD"}
      </div>
    </>
  )
}