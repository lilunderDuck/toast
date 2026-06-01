import { createSignal, onMount } from "solid-js"
// ...
import { css } from "molcss"

const input = css`
  width: 100%;
  resize: none;
  padding-inline: 10px;
  padding-block: 5px;
  border: none;
  background-color: var(--base);
  color: var(--text);
  outline: none;
  border-radius: 7px;
  font-size: 13px;
  // fontFamily: 'Menlo,Monaco,Consolas,Courier New,monospace',
  line-height: 1.25;
  overflow-y: hidden;
`

export function ResizableTextarea(props: HTMLAttributes<"textarea">) {
  const [height, setHeight] = createSignal<string>('auto')

  let textareaRef!: Ref<"textarea">
  const onSlappingYourKeyboard = (inputEvent: InputEvent) => {
    const current = inputEvent.currentTarget as HTMLTextAreaElement
    updateTextarea(current)
    // @ts-ignore
    props.onInput?.(inputEvent)
  }

  const updateTextarea = (someTextarea: HTMLTextAreaElement) => {
    setHeight('auto')
    setHeight(`${someTextarea.scrollHeight}px`)
    console.log('updated height')
  }

  // Update the textarea height right after it mounts.
  // 
  // This exists is because if we set some value to this textarea, its height doesn't update
  // right away. Only when you start typing something, it will update the height correctly
  onMount(() => {
    let timeout = setTimeout(() => {
      console.log('textarea ref is:', textareaRef, '. Updating now')
      updateTextarea(textareaRef!)

      // explicit clean up everything
      clearTimeout(timeout)
    }, 0)
  })

  return (
    <textarea
      {...props}
      ref={textareaRef}
      class={`${input} ${props.class ?? ""}`}
      style={`height: ${height()}`}
      onInput={onSlappingYourKeyboard}
    />
  )
}