import { createSignal, onMount } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { api_getSplashText } from "~/api/misc"
import { mergeClassname } from "~/utils"
// ...

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
    const text = await api_getSplashText()
    setText(text?.text!)
  })
  
  return (
    <span {...props} class={mergeClassname(props, stylex.attrs(style.text))}>
      {text()}
    </span>
  )
}