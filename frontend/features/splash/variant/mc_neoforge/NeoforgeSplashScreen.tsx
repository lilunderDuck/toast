import { createSignal, For, onCleanup, onMount } from "solid-js"
// ...
import { css } from "molcss"
import "./NeoforgeSplashScreen.css"
import "~/styles/animation.css"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable } from "~/components"
import { type backend } from "~/wailsjs/go/models"
import { GetCurrentAppUsage } from "~/wailsjs/go/backend/App"
import { sleep } from "~/utils"
// ...
import { useSplashScreenContext } from "../../provider"
import { NeoforgeLogMessage, NeoforgeProgressBar, NeoforgeSpinningFoxIcon } from "./components"
import { createlogMessageManager, createProgressBarManager } from "./utils"
import type { IPreviewable } from "~/features/settings"

const screen = css`
  background-color: #ef323d;
`

const screen__content = css`
  aspect-ratio: 16 / 9;
  background-color: #ef323d;
  width: 100%;
  height: 56.25cqw;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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

export default function NeoforgeSplashScreen(props: IPreviewable) {
  const { progress$, hideScreen$ } = useSplashScreenContext()
  const { logMessages$, pushLogMessage$ } = createlogMessageManager(props)
  const { addProgressBar$, progressBars$ } = createProgressBarManager()
  const [appUsage, setAppUsage] = createSignal<backend.AppUsage>({
    allocatedMB: 0,
    cpuUsage: 0,
    totalHeapSize: 0
  })

  let appUsageIntervalId = 0

  onMount(async() => {
    appUsageIntervalId = setInterval(async() => {
      const stats = await GetCurrentAppUsage()
      setAppUsage(stats)
    }, 1000) as unknown as number

    pushLogMessage$("toast_engine loading 1.0.0")
    const scanningModProgressBar = addProgressBar$("neoforge_scanning_mod$", {
      isInfiniteLoading$: true,
      label$: "Scanning mod cannidate"
    })

    if (props.preview$) {
      return // stop
    }

    await sleep(2000)
    scanningModProgressBar.updateLabel$("Loading toast")

    await sleep(2000)
    scanningModProgressBar.updateLabel$("Loading bootstrap resources")
    
    await sleep(4000)
    scanningModProgressBar.updateLabel$("Loading mod")

    const steps = [
      "Mod Construction",
      "Registry Initialization",
      "Config Loading",
    ]

    for (const step of steps) {
      const modStateProgressBar = addProgressBar$("neoforge_mod_state$", {
        label$: step,
        currentProgress$: 0
      })

      for (let i = 1; i <= 10; i++) {
        await sleep(100)
        modStateProgressBar.updateProgress$((i / 10) * 100)
      }

      modStateProgressBar.remove$()
      if (step === steps[2]) {
        await sleep(1700)
      }
    }

    scanningModProgressBar.remove$()
    const toastProgress = addProgressBar$("toast_progress$", {
      currentProgress$: 0,
      label$: "Toast progress"
    })

    for (let i = 1; i <= 10; i++) {
      await sleep(100)
      toastProgress.updateProgress$((i / 10) * 100)
      if (i === 5) {
        const sidedSetupProgressBar = addProgressBar$("neoforge_sided_setup$", {
          currentProgress$: 0,
          label$: "Sided setup"
        })

        for (let j = 1; j <= 10; j++) {
          await sleep(100)
          sidedSetupProgressBar.updateProgress$((j / 10) * 100)
        }

        sidedSetupProgressBar.remove$()
      }
    }

    clearInterval(appUsageIntervalId)
    await sleep(2000)
    hideScreen$()
  })

  onCleanup(() => {
    clearInterval(appUsageIntervalId)
  })

  GetCurrentAppUsage().then(setAppUsage)

  const totalHeapUsedInPercentage = () => {
    const percentage = appUsage().allocatedMB / appUsage().totalHeapSize * 100
    return isNaN(percentage) ? 0 : percentage
  }

  return (
    <div 
      class={`${screen} splashScreen__neoforge`}
      data-completed={progress$() === 100} 
      id="splashScreen"
    >
      <AppTitleBarDraggable />
      <div class={screen__content}>
        <div class={screen__memInfo}>
          <NeoforgeProgressBar currentProgress$={totalHeapUsedInPercentage()} />
          Memory: {appUsage().allocatedMB}/{appUsage().totalHeapSize} MB ({totalHeapUsedInPercentage().toFixed(1)}%)  CPU: {appUsage().cpuUsage.toFixed(1)}%
        </div>
        <div
          class={screen__icon}
          style={`--icon:url('${toastIcon}')`}
        />
        <div class={screen__progressBar}>
          <For each={progressBars$()}>
            {it => <NeoforgeProgressBar {...it} />}
          </For>
        </div>
        <NeoforgeLogMessage messages$={logMessages$} />
        <NeoforgeSpinningFoxIcon />
      </div>
    </div>
  )
}