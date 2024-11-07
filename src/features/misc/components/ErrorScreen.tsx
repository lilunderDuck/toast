import stylex from "@stylexjs/stylex"
import __style from "./splash/SplashScreen.module.css"
// ...
import { Transition } from "solid-transition-group"
import { FlexCenter } from "~/components"

const fadeIn = stylex.keyframes({
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
})

const style = stylex.create({
  screen: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    userSelect: 'none',
    backgroundColor: 'var(--app-background-color)',
    position: 'fixed',
    zIndex: 1337,
    animation: `${fadeIn} 0.25s ease-out 0.5s forwards`
  },
  text: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30
  }
})

export function ErrorScreen() {
  return (
    <Transition 
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 })
        a.finished.then(done)
      }}
    >
      <FlexCenter {...stylex.attrs(style.screen)}>
        <h1>A fatal error has occured</h1>
      </FlexCenter>
    </Transition>
  )
}