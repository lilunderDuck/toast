import stylex from "@stylexjs/stylex"

const style = stylex.create({
  audio: {
    paddingInline: 15,
    paddingBlock: 10,
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
      />
    </div>   
  )
}