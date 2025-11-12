import stylex from "@stylexjs/stylex"
import "./SplashScreen.css"
import toastIcon from "~/assets/toast.jpg"
// ...
import { AppTitleBarDraggable, FourDotsSpinningLoader } from "~/components"
// ...
import { Background, Layer } from "../components"
import { useSplashScreenContext } from "../provider"

const style = stylex.create({
  screen: {
    width: "100%",
    height: "100%",
    position: "fixed",
    zIndex: 20,
    backgroundColor: "var(--gray1)",
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
})

interface ISplashScreenProps {
  // ...
}

export function SplashScreen(props: ISplashScreenProps) {
  const { progress$ } = useSplashScreenContext()

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
      <Background />
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