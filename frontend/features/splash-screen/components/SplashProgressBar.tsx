import stylex from "@stylexjs/stylex"

const style = stylex.create({
  thisThing: {
    position: 'absolute',
    width: '100%',
    height: 5,
  },
  progressBar: {
    width: 'var(--progress)',
    height: 5,
    transition: '0.25s ease-out',
    backgroundColor: '#ffbe31ff',
  }
})

export default function SplashProgressBar(props: HTMLAttributes<"div">) {
  return (
    <div {...stylex.attrs(style.thisThing)}>
      <div {...props} {...stylex.attrs(style.progressBar)} />
    </div>
  )
}