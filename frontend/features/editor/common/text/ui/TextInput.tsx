import { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TextInput.module.css"
// ...
import { createLazyLoadedContextMenu, FlexCenterY } from "~/components"
import { dontUpdateIfYouPressSomeKey, setCaretToTheEnd } from "~/features/editor/utils"
// ...
import { useTextDataContext } from "../provider"

const style = stylex.create({
  textinput: {
    paddingInline: 10,
    paddingBlock: 2,
    borderRadius: 6,
    backgroundColor: 'var(--gray3)',
    willChange: 'transform',
    marginBottom: 2
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

export function TextInput(props: ParentProps<ITextInputProps>) {
  const { updateData$, focusState$, addNewLine$, textsData$, spawnNewTextInput$ } = useTextDataContext()
  const [, setWhatInputIsFocused] = focusState$

  let divAsInputRef!: Ref<"div">
  const whenYouTypingStuff: EventHandler<"div", "onKeyDown"> = (keyboardEvent) => {
    const keyYouPress = keyboardEvent.key.toLowerCase()

    // If you press Ctrl + "="
    if (keyboardEvent.ctrlKey && keyYouPress === "=") {
      spawnNewTextInput$(props.currentIndex$)
      return // don't update
    }

    if (keyYouPress === 'enter') {
      keyboardEvent.preventDefault()
      addNewLine$(props.currentIndex$)
      return // don't update
    }

    const shouldDeleteCurrentInput = keyYouPress === "backspace" && isEmpty()
    if (shouldDeleteCurrentInput) {
      const previousTextInputIndex = props.currentIndex$ - 1

      if (previousTextInputIndex > 0) {
        setWhatInputIsFocused(previousTextInputIndex)
        setCaretToTheEnd(document.querySelector(`[data-index=${previousTextInputIndex}]`)!)
      }

      // pass, to save the text data
    }

    if (dontUpdateIfYouPressSomeKey(keyYouPress)) {
      return // don't update
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

  const getInputContent = () => divAsInputRef.textContent?.trim() ?? ''
  const isEmpty = () => getInputContent() === ""

  const mouseHoverTheInput: EventHandler<"div", "onMouseEnter"> = () => {
    setWhatInputIsFocused(props.currentIndex$)
    setCaretToTheEnd(divAsInputRef)
  }

  const TextInputMenu = createLazyLoadedContextMenu(
    () => (
      <div 
        {...stylex.attrs(style.noStupidOutlineThing)} 
        contenteditable 
        onKeyDown={whenYouTypingStuff}
        ref={divAsInputRef}
      >
        {props.value$}
      </div>
    ),
    () => import('./TextInputMenu'),
    () => {
      const currentIndex = props.currentIndex$
      return {
        data$: textsData$()[currentIndex],
        currentIndex$: currentIndex
      }
    }
  )

  return (
    <FlexCenterY 
      {...stylex.attrs(style.textinput)} 
      id={__style.input}
      data-index={props.currentIndex$}
      onMouseEnter={mouseHoverTheInput}
    >
      <TextInputMenu.ContextMenu$ />
      {props.children}
    </FlexCenterY>
  )
}