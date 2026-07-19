import { createSignal, onCleanup, onMount, Show } from "solid-js"
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
import type { IPreviewable } from "~/features/settings"
// ...
import { useSplashScreenContext } from "../../provider"
import { NeoforgeLogMessage, NeoforgeProgressBar, NeoforgeSpinningFoxIcon } from "./components"
import { createlogMessageManager } from "./utils"

const screen = css`
  background-color: #ef323d;
  font-size: 150%;
`

const screen__contentBound = css`
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
  padding-top: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`

const screen__progressBar = css`
  width: 100%;
  padding-top: 25%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 5px;
`

const screen__icon = css`
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  background: center center no-repeat var(--icon);
  background-size: contain;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 15px;
  animation: animation_fadeIn 1.3s ease-out;
`

export default function NeoforgeSplashScreen(props: IPreviewable) {
  const { progress$, hideScreen$ } = useSplashScreenContext()
  // replicating StartupNotificationManager.addModMessage()
  const { logMessages$, pushLogMessage$ } = createlogMessageManager(props)
  const [appUsage, setAppUsage] = createSignal<backend.AppUsage>({
    allocatedMB: 0,
    cpuUsage: 0,
    totalHeapSize: 0
  })

  const [isShowingIcon, setIsShowingIcon] = createSignal(false)

  // We can't really use an signal of object here, because the infinite loading
  // bar will be reset, while in the original screen, that white bar doesn't reset its position

  // It's messy
  const [isFirstProgressBarInfLoading, setIsFirstProgressBarInfLoading] = createSignal(false)
  const [firstProgressBarText, setFirstProgressBarText] = createSignal("")
  const [firstProgressBarProgress, setFirstProgressBarProgress] = createSignal(0)

  const [isSecondProgressBarShowing, setIsSecondProgressBarShowing] = createSignal(false)
  const [secondProgressBarText, setSecondProgressBarText] = createSignal("")
  const [secondProgressBarProgress, setSecondProgressBarProgress] = createSignal(0)

  let appUsageIntervalId = 0
  const startTime = performance.now()

  onMount(async() => {
    appUsageIntervalId = setInterval(async() => {
      setAppUsage(await GetCurrentAppUsage())
    }, 1000) as unknown as number

    await preLaunch()

    if (props.preview$) {
      return // stop
    }

    await bootstrapping()
    await loadingPhrase()
    await temporaryFreeze()
    await finalPhrase()

    await hideScreen()
  })

  const preLaunch = async() => {
    pushLogMessage$("toast_engine loading 1.0.0")
    setIsFirstProgressBarInfLoading(true)
    setFirstProgressBarText("Scanning breadcrumbs cannidate")
    await sleep(2000)
  }

  const bootstrapping = async() => {
    setFirstProgressBarText("Loading bootstrap resources")
    await sleep(2000)
  }

  // there's no lore here...
  const REGISTRY_WHICH_DID_OR_DID_NOT_EXIST = [
    "toast:panic_handlers",
    "toast:do_the_ducks_watch_you?",
    "toast:toasts",
    "toast:bots_should_not_see_this",
    "toast:breadcrumbs_global_modifier", // -> neoforge:global_loot_modifier
    "toast:follow_the_white_rabbit",
    "toast:engine_throttler",
    "toast:the_ram_squeezer_3000",
    "toast:spinning_violently_around_the_y_axis",
  ]

  const loadingPhrase = async() => {
    pushLogMessage$("toast_engine version 1.0.0")
    setFirstProgressBarText("Loading toast")
    await sleep(200)
    for (const registryName of REGISTRY_WHICH_DID_OR_DID_NOT_EXIST) {
      pushLogMessage$(`REGISTERING ${registryName}`)
      await sleep(100)
    }
    await sleep(2000)
  }

  // Currently faking the progress, will add call to the backend later
  const finalPhrase = async() => {
    setFirstProgressBarText("Toast progress")
    setIsFirstProgressBarInfLoading(false)
    setIsShowingIcon(true)

    await sleep(500)
    setFirstProgressBarProgress(25)

    await Promise.all([
      mainProgress(),
      sidedSetup()
    ])
    
    setFirstProgressBarProgress(100)
    await sleep(2000)

    pushLogMessage$("All of the bread are belong to us")
    await sleep(200)
    const waitTime = ((performance.now() - startTime) / 1000).toFixed(1)
    pushLogMessage$(`You're been chilled for ${waitTime} seconds`)
  }

  const mainProgress = async() => {
    setFirstProgressBarProgress(25)
    await sleep(200)
    setFirstProgressBarProgress(50)
    await sleep(900)
    setFirstProgressBarProgress(50)
    await sleep(800)
  }

  const sidedSetup = async() => {
    setIsSecondProgressBarShowing(true)
    setSecondProgressBarText("Sided setup: check if server is alive")
    setFirstProgressBarProgress(50)
    await sleep(1000)
    setSecondProgressBarText("Sided setup: please don't panic")
    setSecondProgressBarProgress(75)
    await sleep(500)
    setSecondProgressBarProgress(100)
    await sleep(500)
    setIsSecondProgressBarShowing(false)
  }

  // there's a small freeze between finishing loading the mods and minecraft progress
  // due to (Neo)Forge is attempting the window handshake to minecraft.
  // let's just adding that freeze shall we?
  const temporaryFreeze = async() => {
    // TODO
  }

  const hideScreen = async() => {
    clearInterval(appUsageIntervalId)
    await sleep(2000)
    hideScreen$()
  }

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
      <div class={screen__contentBound}>
        <div class={screen__memInfo}>
          <NeoforgeProgressBar currentProgress$={totalHeapUsedInPercentage()} />
          Memory: {appUsage().allocatedMB}/{appUsage().totalHeapSize} MB ({totalHeapUsedInPercentage().toFixed(1)}%)   CPU: {appUsage().cpuUsage.toFixed(1)}%
        </div>
        <Show when={isShowingIcon()}>
          <div
            class={screen__icon}
            style={`--icon:url('${toastIcon}')`}
          />
        </Show>
        <div class={screen__progressBar}>
          <NeoforgeProgressBar 
            currentProgress$={firstProgressBarProgress()} 
            label$={firstProgressBarText()}
            isInfiniteLoading$={isFirstProgressBarInfLoading()}
            />
          <Show when={isSecondProgressBarShowing()}>
            <NeoforgeProgressBar 
              currentProgress$={secondProgressBarProgress()}
              label$={secondProgressBarText()}
            />
          </Show>
        </div>
        <NeoforgeLogMessage messages$={logMessages$} />
        <NeoforgeSpinningFoxIcon />
      </div>
    </div>
  )
}