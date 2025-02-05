import stylex from "@stylexjs/stylex"

const style = stylex.create({
  thisThing: {
    position: 'absolute',
    width: '100%',
    paddingTop: 5,
    paddingLeft: 10,
    fontSize: 14
  }
})

export default function SplashInfoText(props: HTMLAttributes<"div">) {
  return (
    <div {...props} {...stylex.attrs(style.thisThing)} />
  )
}