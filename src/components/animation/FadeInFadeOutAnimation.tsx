import { ParentProps } from "solid-js"
import { Transition } from "solid-transition-group"

export function FadeInFadeOutAnimation(props: ParentProps) {
  return (
    <Transition 
      onEnter={(el, done) => {
        const a = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200 })
        a.finished.then(done)
      }}
      onExit={(el, done) => {
        const a = el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 })
        a.finished.then(done)
      }}
    >
      {props.children}
    </Transition>
  )
}