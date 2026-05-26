import stylex from "@stylexjs/stylex"
import toastIcon from "~/assets/toast.jpg"
// ...
import { FourDotsSpinningLoader } from "~/components"

const style = stylex.create({
  screen: {
    backgroundColor: "var(--crust)",
    width: "100%",
    height: "85%",
    position: "relative"
  },
  screen__iconWrap: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    position: "absolute"
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
  }
})

export default function DefaultSplashScreen() {
  return (
    <div {...stylex.attrs(style.screen)}>
      <div {...stylex.attrs(style.screen__iconWrap)}>
        <div
          {...stylex.attrs(style.screen__icon)}
          style={`--icon:url('${toastIcon}')`}
        />
      </div>
      <div {...stylex.attrs(style.screen__loader)}>
        <FourDotsSpinningLoader />
      </div>
    </div>
  )
}