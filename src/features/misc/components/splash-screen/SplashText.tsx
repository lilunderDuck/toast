import stylex from "@stylexjs/stylex"
import { fetchIt, mergeClassname } from "~/utils"
// you can't stop me adding silly loading text
import { createSignal, onMount } from "solid-js"
import { apiRoute } from "~/common"

const style = stylex.create({
  text: {
    fontSize: 14,
    width: '80vw',
    textAlign: 'center',
  }
})

export default function SplashText(props: HTMLAttributes<"span">) {
  const [text, setText] = createSignal('')
  onMount(async() => {
    const text = await fetchIt<{ text: string }>('GET', apiRoute('/splash-text'))
    setText(text?.text!)
  })
  
  return (
    <span {...props} class={mergeClassname(props, stylex.attrs(style.text))}>
      {text()}
    </span>
  )
}