import stylex from "@stylexjs/stylex"
import { useAudioContext } from "../AudioProvider"

const style = stylex.create({
  audio__progressBarWrap: {
    width: "100%",
    height: 20 
  },
  audio__progressBar: {
    width: "var(--progress)",
    height: 20
  }
})

export function AudioProgress() {
  const { progress$ } = useAudioContext()

  return (
    <div {...stylex.attrs(style.audio__progressBarWrap)} style={{
      "--progress": progress$()
    }}>
      <div {...stylex.attrs(style.audio__progressBar)} />
    </div>
  )
}