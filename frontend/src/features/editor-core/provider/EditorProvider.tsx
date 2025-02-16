import { type Accessor, createContext, createSignal, type ParentProps, Setter, useContext } from "solid-js"
// ...
import { createBlocks, type IBlockUtils } from "./blocks"
import { IBlockSetting } from "./blockData"
import { createButtonRow, IButtonRowUtils } from "./buttonRow"
import { editor_log } from "../utils"

interface IEditorProviderProps {
  blockSetting$: Record<number, IBlockSetting<any>>
  defaultBlock$: {
    setting$: IBlockSetting<any>
    type$: number
  }
}

export interface IEditorContext extends IEditorProviderProps {
  blocks$: IBlockUtils
  buttonRow$: IButtonRowUtils
  readonly$: Accessor<boolean>
  setIsReadonly$: Setter<boolean>
}

const Context = createContext<IEditorContext>()

export function EditorProvider(props: ParentProps<IEditorProviderProps>) {
  const [readonly, setIsReadonly] = createSignal(false)
  const buttonRow = createButtonRow()
  const block = createBlocks(buttonRow, () => props.blockSetting$)

  const defaultBlockType = props.defaultBlock$.type$
  props.blockSetting$[defaultBlockType] = props.defaultBlock$.setting$
  block.insert$(null, defaultBlockType, props.defaultBlock$.setting$.defaultValue$)

  editor_log("Created with block setting", props.blockSetting$)

  return (
    <Context.Provider value={{
      blocks$: block,
      blockSetting$: props.blockSetting$,
      defaultBlock$: props.defaultBlock$,
      buttonRow$: buttonRow,
      readonly$: readonly,
      setIsReadonly$: setIsReadonly,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}