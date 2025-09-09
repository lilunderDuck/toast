import stylex from "@stylexjs/stylex"

const style = stylex.create({
  audioIcon: {
    width: "var(--bound)",
    height: "var(--bound)"
  }
})

interface IAudioIconProps {
  iconSize$: number
}

export function AudioIcon(props: IAudioIconProps) {
  return (
    <img 
      {...stylex.attrs(style.audioIcon)} 
      style={{ "--bound": `${props.iconSize$}px` }}
      src=""
      loading="lazy"
    >
      {/*  */}
    </img>
  )
}