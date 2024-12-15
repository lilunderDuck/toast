import { createSignal, Show } from "solid-js"
import stylex from "@stylexjs/stylex"
import __style from "./SplashScreen.module.css"
// ...
import SplashText from "./SplashText"
import SplashProgressBar from "./SplashProgressBar"
import SplashInfoText from "./SplashInfoText"
import { Transition } from "solid-transition-group"

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
    zIndex: 1337
  },
  screen_fadeIn: {
    animation: `${fadeIn} 0.25s ease-out 0.5s forwards`
  },
  text: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 30
  }
})

export namespace SplashScreen {
  const [progress, setProgress] = createSignal(0)
  const [text, setText] = createSignal('')
  const [isVisible, setIsVisible] = createSignal(true)

  export const 
    $setProgress = setProgress,
    $setText = setText,
    $setIsVisible = setIsVisible
  // 

  export function $Screen() {
    return (
      <Transition 
        onExit={(el, done) => {
          const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 })
          a.finished.then(done)
        }}
      >
        <Show when={isVisible()}>
          <div {...stylex.attrs(style.screen)}>
            <SplashProgressBar style={{
              '--progress': `${progress()}%`
            }} />
            <SplashInfoText>
              {text()}
            </SplashInfoText>
            <SplashText {...stylex.attrs(style.text)} />
          </div>
        </Show>
      </Transition>
    )
  }
}