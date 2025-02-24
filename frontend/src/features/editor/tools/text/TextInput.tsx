import stylex from "@stylexjs/stylex"
import __style from "./TextInput.module.css"
import { ParentProps } from "solid-js"
import { FlexCenterY } from "~/components"
import { useTextDataContext } from "./TextProvider"
import { setCaretToTheEnd } from "~/features/editor/utils"

const style = stylex.create({
  textinput: {
    paddingInline: 10,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: 'var(--gray5)',
    willChange: 'transform',
    marginBottom: 10
  },
  noStupidOutlineThing: {
    border: 'none',
    outline: 'none',
    minWidth: 50,
    wordBreak: 'break-all'
  },
  buttonRow: {
    marginLeft: 10,
    gap: 5,
    flexShrink: 0
  }
})

interface ITextInputProps {
  value$: string
  currentIndex$: number
}

export default function TextInput(props: ParentProps<ITextInputProps>) {
  const { updateData$, focusState$ } = useTextDataContext()
  const [, setWhatInputIsFocused] = focusState$

  let divAsInputRef!: Ref<"div">
  const whenYouTypingStuff: EventHandler<"div", "onKeyDown"> = (keyboardEvent) => {
    const keyYouPress = keyboardEvent.key.toLowerCase()

    if (keyYouPress === 'enter') { // don't make new line
      keyboardEvent.preventDefault()
    }

    if (dontUpdateIfYouPressSomeKey(keyYouPress)) {
      return // do not update
    }

    // do a weird hack here because you doesn't get the correct value on the "input"
    const timeout = setTimeout(() => {
      const content = getInputContent()
      updateData$(props.currentIndex$, {
        text: content
      })
  
      clearTimeout(timeout)
    }, 0)
  }

  const dontUpdateIfYouPressSomeKey = (keyYouPress: string) => {
    const dontUpdateThose = [
      'control', 
      'shift', 
      'enter'
    ].includes(keyYouPress)

    const containArrowKey = keyYouPress.includes('arrow')

    return containArrowKey || dontUpdateThose
  }

  const getInputContent = () => divAsInputRef.textContent?.trim() ?? ''

  const mouseHoverTheInput: EventHandler<"div", "onMouseEnter"> = () => {
    setWhatInputIsFocused(props.currentIndex$)
    setCaretToTheEnd(divAsInputRef)
  }

  return (
    <FlexCenterY 
      {...stylex.attrs(style.textinput)} 
      id={__style.input}
      data-index={props.currentIndex$}
      onMouseEnter={mouseHoverTheInput}
    >
      <div 
        {...stylex.attrs(style.noStupidOutlineThing)} 
        contenteditable 
        onKeyDown={whenYouTypingStuff}
        ref={divAsInputRef}
      >
        {props.value$}
      </div>
      {props.children}
    </FlexCenterY>
  )
}