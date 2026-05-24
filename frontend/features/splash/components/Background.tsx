import stylex from "@stylexjs/stylex"
import background from "../assets/background.svg"
// ...
import { Layer } from "./Layer"

const style = stylex.create({
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

export function Background() {
  return (
    <Layer data-background {...stylex.attrs(style.background)} style={`--background:url('${background}')`}>
      <div {...stylex.attrs(style.background__filter)} />
    </Layer>
  )
}