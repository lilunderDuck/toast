import stylex from "@stylexjs/stylex"
import { SpinningCube } from "~/components"

const style = stylex.create({
  screen: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 10
  }
})

export function JournalLoadingScreen() {
  return (
    <div {...stylex.attrs(style.screen)}>
      <SpinningCube cubeSize$={20} />
      Loading...
    </div>
  )
}