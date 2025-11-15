import stylex from "@stylexjs/stylex"
import { macro_mergeClassnames } from "macro-def"
import { createSignal, onMount } from "solid-js"

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

  let textareaRef!: Ref<"textarea">
  const onSlappingYourKeyboard = (inputEvent: InputEvent) => {
    const current = inputEvent.currentTarget as HTMLTextAreaElement
    updateTextarea(current)
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
      class={macro_mergeClassnames(props, stylex.attrs(style.input))}
      style={`height: ${height()}`}
      onInput={onSlappingYourKeyboard}
    />
  )
}