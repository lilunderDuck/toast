import { Accessor, createContext, createSignal, ParentProps, Signal, useContext } from "solid-js"
// ...
import { editor_log } from "~/features/editor/utils"
import { array_insert } from "~/common"
// ...
import { TextData } from "./data"

interface ITextProviderProps {
  inputData$?: TextData[]
  onChange$(value: TextData[]): void
}

interface ITextContext {
  textsData$: Accessor<TextData[]>
  updateData$(index: number, data: Partial<TextData>): void
  spawnNewTextInput$(index: number): void
  deleteInput$(index: number): void
  onChange$(value: TextData[]): void
  focusState$: Signal<number>
}

const Context = createContext<ITextContext>()

export function TextDataProvider(props: ParentProps<ITextProviderProps>) {
  const [textsData, setTextsData] = createSignal<TextData[]>(props.inputData$ ?? [
    { text: '' }
  ])

  const updateData = (index: number, data: Partial<TextData>) => {
    setTextsData(prev => {
      const prevDataOfDatIndex = prev[index]
      const newData = {...prevDataOfDatIndex, ...data}
      for (const [key, value] of Object.entries(newData)) {
        if (value === 0 || !value) {
          // @ts-ignore - should work with absolutely no weird thing happening under the hood
          delete newData[key]
        }
      }

      prev[index] = newData
      context.onChange$(textsData())
      editor_log('[text] update text data at index', index, 'with', data, '. Data is', prev[index])
      return prev
    })
  }

  const spawnNewTextInput = (index: number) => {
    setTextsData(prev => {
      array_insert(prev, index, {
        text: ''
      })
      return [...prev]
    })
    context.onChange$(textsData())
    editor_log('[text] Spawned new block')
  }

  const deleteInput = (index: number) => {
    setTextsData(prev => {
      prev.splice(index, 1)
      return [...prev]
    })

    context.onChange$(textsData())
    editor_log('[text] Deleted block at index', index)
  }

  const context = {
    focusState$: createSignal(0),
    textsData$: textsData,
    updateData$: updateData,
    spawnNewTextInput$: spawnNewTextInput,
    deleteInput$: deleteInput,
    onChange$: props.onChange$
  }

  return (
    <Context.Provider value={context}>
      {props.children}
    </Context.Provider>
  )
}

export function useTextDataContext() {
  return useContext(Context)!
}