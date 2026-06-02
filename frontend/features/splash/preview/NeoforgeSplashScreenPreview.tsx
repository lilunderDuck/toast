import { createSignal, onMount } from "solid-js"
// ...
import { css } from "molcss"
import "../variant/mc_neoforge/NeoforgeSplashScreen.css"
import "~/styles/animation.css"
import toastIcon from "~/assets/toast.jpg"
// ...
import { type backend } from "~/wailsjs/go/models"
import { GetCurrentAppUsage } from "~/wailsjs/go/backend/App"
// ...
import { NeoforgeLogMessage, NeoforgeProgressBar, NeoforgeSpinningFoxIcon } from "../variant/mc_neoforge/components"

const screen__content = css`
  background-color: #ef323d;
  width: 100%;
  height: 85%;
  position: relative;
`

const screen__memInfo = css`
  padding-top: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`

const screen__progressBar = css`
  width: 100%;
  padding-top: 12rem;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`

const screen__icon = css`
  width: 10rem;
  height: 10rem;
  border-radius: 50%;
  background: center center no-repeat var(--icon);
  background-size: contain;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1px;
  animation: animation_fadeIn 0.25s ease-out;
`

export default function NeoforgeSplashScreenPreview() {
  const [appUsage, setAppUsage] = createSignal<backend.AppUsage>({
    allocatedMB: 0,
    cpuUsage: 0,
    totalHeapSize: 0
  })

  onMount(async () => {
    const stats = await GetCurrentAppUsage()
    setAppUsage(stats)
  })

  const totalHeapUsedInPercentage = () => {
    const percentage = appUsage().allocatedMB / appUsage().totalHeapSize * 100
    return isNaN(percentage) ? 0 : percentage
  }

  return (
    <div class={`${screen__content} splashScreen__neoforge`}>
      <div class={screen__memInfo}>
        <NeoforgeProgressBar currentProgress$={totalHeapUsedInPercentage()} />
        Memory: {appUsage().allocatedMB}/{appUsage().totalHeapSize} MB ({totalHeapUsedInPercentage().toFixed(1)}%)  CPU: {appUsage().cpuUsage.toFixed(1)}%
      </div>
      <div
        class={screen__icon}
        style={`--icon:url('${toastIcon}')`}
      />
      <div class={screen__progressBar}>
        <NeoforgeProgressBar
          isInfiniteLoading$={true}
          label$="Scanning mod cannidate"
        />
      </div>
      <NeoforgeLogMessage messages$={() => [
        { id$: 0, isFading$: false, text$: "toast_engine loading 1.0.0" }
      ]} />
      <NeoforgeSpinningFoxIcon />
    </div>
  )
}