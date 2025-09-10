import stylex from "@stylexjs/stylex"
import { BsOpticalAudioFill } from "solid-icons/bs"

const style = stylex.create({
  view: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    gap: 15
  }
})

export function PlaylistEmptyView() {
  return (
    <div {...stylex.attrs(style.view)}>
      <BsOpticalAudioFill size={30} />
      <span>Click to create a playlist</span>
    </div>
  )
}