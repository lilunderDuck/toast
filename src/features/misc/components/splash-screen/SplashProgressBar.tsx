import stylex from "@stylexjs/stylex"

const style = stylex.create({
  thisThing: {
    position: 'absolute',
    width: '100%',
    height: 7,
  },
  progressBar: {
    width: 'var(--progress)',
    height: 7,
    transition: '0.25s ease-out',
    backgroundImage: 'linear-gradient(to right, #d16ba5, #c777b9, #ba83ca, #aa8fd8, #9a9ae1, #8aa7ec, #79b3f4, #69bff8, #52cffe, #41dfff, #46eefa, #5ffbf1)',
  }
})

export default function SplashProgressBar(props: HTMLAttributes<"div">) {
  return (
    <div {...stylex.attrs(style.thisThing)}>
      <div {...props} {...stylex.attrs(style.progressBar)} />
    </div>
  )
}