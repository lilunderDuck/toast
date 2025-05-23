import { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./TextInput.module.css"
// ...
import { createLazyLoadedContextMenu, FlexCenterY } from "~/components"
import { dontUpdateIfYouPressSomeKey, setCursorToTheEnd, setCursorToTheStart } from "~/features/editor/utils"
// ...
import { TextType, useTextDataContext } from "../provider"
import { __run, editorLog } from "~/features/debug"

const style = stylex.create({
  textinput: {
    paddingInline: 4,
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
  const { 
    updateData$, 
    focusState$, 
    addNewLine$, 
    textsData$, 
    spawnNewTextInput$, 
    deleteInput$,
    getInputElement$
  } = useTextDataContext()
  const [, setWhatInputIsFocused] = focusState$

  let divAsInputRef!: Ref<"div">
  const whenYouTypingStuff: EventHandler<"div", "onKeyDown"> = (keyboardEvent) => {
    const keyYouPress = keyboardEvent.key.toLowerCase()

    // move input to input check
    if (keyYouPress === "arrowleft") {
      moveCursorFromInputToInput("left")
      return // don't update
    }

    if (keyYouPress === "arrowright") {
      moveCursorFromInputToInput("right")
      return // don't update
    }

    // press Ctrl + "I" to create new input.
    // duck note: nah, this key combination sucks.
    // I prefer Shift + Enter instead
    if (keyboardEvent.shiftKey && keyYouPress === "enter") {
      spawnNewTextInput$(props.currentIndex$)
      return // don't update
    }

    // spawn new input check
    if (keyYouPress === 'enter') {
      keyboardEvent.preventDefault()
      addNewLine$(props.currentIndex$)
      delayRun(() => {
        setCursorToTheStart(getInputElement$(props.currentIndex$))
      }, 50)
      return // don't update
    }

    // handle delete input
    const shouldDeleteCurrentInput = ["backspace", "delete"].includes(keyYouPress) && isInputEmpty()
    if (shouldDeleteCurrentInput) {
      dealWithDeletingInput()
    }

    if (dontUpdateIfYouPressSomeKey(keyYouPress)) return // don't update

    saveInputContent()
  }

  const moveCursorFromInputToInput = (direction: "left" | "right") => {
    const selection = window.getSelection()!
    let currentCursorPosition = selection.anchorOffset
    const currentText = getInputContent()
    if (direction === "left") {
      currentCursorPosition -= 1
    }

    isDevMode && __run(() => {
      let virturalCursorPos = new Array(currentText.length).fill(' ')
      virturalCursorPos[currentCursorPosition] = `^ (${currentText[currentCursorPosition]})`
      editorLog.logLabel("text", "[cursor]", "current position", `
        ${currentText}
        ${virturalCursorPos.join("")}  
      `)
    })

    if (currentText[currentCursorPosition] !== undefined) return // moving cursor inside the input

    // cursor out of bound checks
    let nextBlockIndex = direction === "left" ? props.currentIndex$ - 1 : props.currentIndex$ + 1
    const nextBlock = textsData$()[nextBlockIndex]
    if (nextBlock === undefined) {
      isDevMode && editorLog.logLabel("text", "[cursor]", "out of bound")
      return
    }

    if (nextBlock.type === TextType.newLine) {
      // add or subtract by 1 to move the cursor to the next input 
      // instead of moving the cursor to the new line element
      nextBlockIndex = direction === "left" ? props.currentIndex$ - 2: props.currentIndex$ + 2
    }

    isDevMode && editorLog.logLabel("text", "[cursor]", "moving to input index", nextBlockIndex)

    switch (direction) {
      case "left":
        setCursorToTheEnd(getInputElement$(nextBlockIndex))
        isDevMode && editorLog.logLabel("text", "[cursor]", "move to next block")
      break
        
      case "right":
        setCursorToTheStart(getInputElement$(nextBlockIndex))
        isDevMode && editorLog.logLabel("text", "[cursor]", "move to prev block")
      break
    }
  }

  const dealWithDeletingInput = () => {
    const previousTextInputIndex = props.currentIndex$ - 1

    if (previousTextInputIndex < 0) {
      // if we manage to get into this condition, that means
      // the text block only has 1 input left.
      // 
      // don't delete, pass, to save the text data
      return 
    }

    // f o c u s
    const prevInputData = textsData$()[previousTextInputIndex]
    if (prevInputData.type === TextType.text) {
      setWhatInputIsFocused(previousTextInputIndex)
      setCursorToTheStart(getInputElement$(previousTextInputIndex))
    } // else, don't focus.

    deleteInput$(props.currentIndex$)
  }

  const saveInputContent = () => {
    // do a weird hack here because you doesn't get the correct value on the "input"
    delayRun(() => {
      const content = getInputContent()
      updateData$(props.currentIndex$, {
        text: content
      })
    })
  }

  const delayRun = (fn: AnyFunction, timeInMs: number = 0) => {
    const timeout = setTimeout(() => {
      fn()
      clearTimeout(timeout)
    }, timeInMs)
  }

  const getInputContent = () => divAsInputRef.textContent?.trim() ?? ''
  const isInputEmpty = () => getInputContent() === ""

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
    >
      <TextInputMenu.ContextMenu$ />
      {props.children}
    </FlexCenterY>
  )
}