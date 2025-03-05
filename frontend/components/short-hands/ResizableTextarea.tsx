import stylex from "@stylexjs/stylex"
import { createSignal, onMount } from "solid-js"
import { getRandomNumber } from "~/utils"

const style = stylex.create({
  input: {
    width: '100%',
    resize: 'none',
    paddingInline: 10,
    paddingBlock: 5,
    border: 'none',
    backgroundColor: 'var(--gray3)',
    color: 'var(--gray12)',
    outline: 'none',
    borderRadius: 7,
    fontSize: 13,
    fontFamily: 'Menlo,Monaco,Consolas,Courier New,monospace',
    lineHeight: 1.25,
    overflowY: 'hidden',
  }
})

export function ResizableTextarea(props: HTMLAttributes<"textarea">) {
  const [height, setHeight] = createSignal<string>('auto')

  const onSlappingYourKeyboard = (inputEvent: InputEvent) => {
    const current = inputEvent.currentTarget as HTMLTextAreaElement
    updateTextarea(current)
  }

  const updateTextarea = (someTextarea: HTMLTextAreaElement) => {
    setHeight('auto')
    setHeight(`${someTextarea.scrollHeight}px`)
    console.log('[ResizableTextarea] updated height')
  }

  // update the textarea height right after it mounts.
  // 
  // this exist is because if we set some value to this textarea, its height doesn't update
  // right away. Only when you start typing something, it will update the height correctly
  let textareaId = `_${getRandomNumber(100_000)}${isDevMode ? '-did-not-intentionally-add-this' : ''}`
  onMount(() => {
    console.group('[ResizableTextarea] mounted')
    let timeout = setTimeout(() => {
      const textareaRef = document.getElementById(textareaId) as HTMLTextAreaElement | null
      console.assert(textareaRef, `cannot select textarea id: ${textareaId}`)

      console.log('textarea ref is:', textareaRef, '. Updating now')
      updateTextarea(textareaRef!)

      // explicit clean up everything
      console.log('clean up')
      clearTimeout(timeout)
      console.groupEnd()
    }, 0)
  })

  return (
    <textarea 
      {...stylex.attrs(style.input)} 
      {...props}
      id={textareaId}
      style={`height: ${height()}`}
      onInput={onSlappingYourKeyboard}
    />
  )
}