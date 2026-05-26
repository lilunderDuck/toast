import { onMount } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable, FourDotsSpinningLoader } from "~/components"
import { sleep } from "~/utils"
// ...
import { Layer } from "../../components"
import { useSplashScreenContext } from "../../provider"

const style = stylex.create({
  screen: {
    backgroundColor: "var(--crust)",
  },
  screen__titleBarDraggable: {
    position: "absolute"
  },
  screen__iconWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  screen__icon: {
    width: "12rem",
    height: "12rem",
    borderRadius: "50%",
    background: "center center no-repeat var(--icon)",
    backgroundSize: "contain"
  },
  screen__loader: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 10
  },
  screen__progressBar: {
    width: "var(--progress)",
    backgroundColor: "var(--blue9)",
    height: 5,
    position: "absolute",
    top: 0,
    transition: "all 0.25s ease-out"
  },
  background: {
    background: "center center no-repeat var(--background)",
    backgroundSize: "cover",
    opacity: 0,
  },
  background__filter: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backdropFilter: "blur(2px)",
    backgroundColor: "#00000022",
  }
})

export default function DefaultSplashScreen() {
  const { progress$, hideScreen$ } = useSplashScreenContext()

  onMount(async() => {
    await sleep(2000)
    hideScreen$()
  })

  return (
    <div 
      {...stylex.attrs(style.screen)} 
      style={`--progress:${progress$()}%`} 
      id="splashScreen"
      data-completed={progress$() === 100}
    >
      <AppTitleBarDraggable
        {...stylex.attrs(style.screen__titleBarDraggable)}
      />
      <Layer {...stylex.attrs(style.screen__iconWrap)}>
        <div
          {...stylex.attrs(style.screen__icon)}
          style={`--icon:url('${toastIcon}')`}
        />
      </Layer>
      {/* <div {...stylex.attrs(style.screen__progressBar)} /> */}
      <div {...stylex.attrs(style.screen__loader)}>
        <FourDotsSpinningLoader />
      </div>
    </div>
  )
}