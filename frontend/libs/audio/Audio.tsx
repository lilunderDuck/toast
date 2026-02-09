import stylex from "@stylexjs/stylex"
import { AudioProgress } from "./components"
import { useAudioContext } from "./AudioProvider"

const style = stylex.create({
  audio: {
    paddingInline: 15,
    paddingBlock: 10,
    backgroundColor: "var(--gray3)",
    borderRadius: 6,
  }
})

interface IAudioProps {
  src$: string
}

export function Audio(props: IAudioProps) {
  return (
    <div {...stylex.attrs(style.audio)}>
      <audio 
        src={props.src$} 
        onTimeUpdate={() => null} 
      />
      <AudioProgress />
    </div>   
  )
}