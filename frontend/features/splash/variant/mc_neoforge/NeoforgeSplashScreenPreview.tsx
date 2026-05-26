import { createSignal, onMount } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import "./NeoforgeSplashScreen.css"
import "~/styles/animation.css"
import toastIcon from "~/assets/toast.jpg"
// ...
import { type backend } from "~/wailsjs/go/models"
import { GetCurrentAppUsage } from "~/wailsjs/go/backend/App"
// ...
import { NeoforgeLogMessage, NeoforgeProgressBar, NeoforgeSpinningFoxIcon } from "./components"
import { CLS } from "macro-def"

const style = stylex.create({
  screen__content: {
    backgroundColor: "#ef323d",
    width: "100%",
    height: "85%",
    position: "relative"
  },
  screen__memInfo: {
    paddingTop: 5,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 5
  },
  screen__progressBar: {
    width: "100%",
    paddingTop: "12rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 5
  },
  screen__messageLog: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    paddingLeft: 10,
    paddingBottom: 5
  },
  screen__icon: {
    width: "10rem",
    height: "10rem",
    borderRadius: "50%",
    background: "center center no-repeat var(--icon)",
    backgroundSize: "contain",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    marginTop: 10,
    animation: "animation_fadeIn 0.25s ease-out"
  },
})

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
    <div class={`${CLS(style.screen__content)} splashScreen__neoforge`}>
      <div {...stylex.attrs(style.screen__memInfo)}>
        <NeoforgeProgressBar currentProgress$={totalHeapUsedInPercentage()} />
        Memory: {appUsage().allocatedMB}/{appUsage().totalHeapSize} MB ({totalHeapUsedInPercentage().toFixed(1)}%)  CPU: {appUsage().cpuUsage.toFixed(1)}%
      </div>
      <div
        {...stylex.attrs(style.screen__icon)}
        style={`--icon:url('${toastIcon}')`}
      />
      <div {...stylex.attrs(style.screen__progressBar)}>
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