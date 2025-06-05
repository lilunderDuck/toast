import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
import lzstring from "lz-string"
// ...
import { debounce } from "~/utils"
import { editorLog } from "~/features/debug"
// ...
import type { InputTextData } from "./data"

export interface ITextProviderProps {
  allowNewLine$?: boolean
  inputData$?: InputTextData
  onChange$(value: string): void
  onAddingNewLine$?: () => any
  onEmpty?: () => any
}

export interface ITextContext {
  textsData$: Accessor<string>
  handleInput$: EventHandler<"textarea", "onInput">
  handleKeyInput$: EventHandler<"textarea", "onKeyDown">
}

const Context = createContext<ITextContext>()

export function TextDataProvider(props: ParentProps<ITextProviderProps>) {
  let inputText = props.inputData$?.text
  const [textsData, setTextsData] = createSignal<string>(
    inputText ? lzstring.decompressFromUTF16(inputText) : ''
  )

  const isAllowNewLine = props.allowNewLine$ ?? true
  
  const debounceUpdate = debounce((data: string) => {
    props.onChange$(lzstring.compressToUTF16(data))
    isDevMode && editorLog.logLabel("text", "updated")
  }, 100)
  
  const handleInput: EventHandler<"textarea", "onInput"> = (inputEvent) => {
    const data = inputEvent.currentTarget.value
    setTextsData(data)
    debounceUpdate(data)
  }

  const handleKeyInput: EventHandler<"textarea", "onKeyDown"> = (keyboardEvent) => {
    const keyYouPressed = keyboardEvent.key.toLowerCase()
    if (!isAllowNewLine && keyYouPressed === "enter") {
      keyboardEvent.preventDefault()
    }
    
    if (keyYouPressed === "tab") {
      keyboardEvent.preventDefault()
    }

    // pass
  }

  return (
    <Context.Provider value={{
      textsData$: textsData,
      handleInput$: handleInput,
      handleKeyInput$: handleKeyInput
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useTextDataContext() {
  return useContext(Context)!
}