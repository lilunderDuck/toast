import { type Accessor, createContext, createSignal, type ParentProps, useContext } from "solid-js"
import { DEFAULT_TEXT_DATA, TextData } from "~/features/editor/common/text"
import { IListBlockData } from "./data"
import { arrayObjects } from "~/utils"

interface IListDataProviderProps {
  dataIn$: IListBlockData
  onChange$(data: IListBlockData): void
}

interface IListDataContext {
  addItem$(): void
  updateItem$(atIndex: number, data: TextData[]): void
  deleteItem$(atIndex: number): void
  data$: Accessor<IListBlockData>
}

const Context = createContext<IListDataContext>()

export function ListDataProvider(props: ParentProps<IListDataProviderProps>) {
  const [data, setData] = createSignal(props.dataIn$)

  const updateTextData = (atIndex: number, data: IListBlockData, newTextData: TextData[]) => {
    data.items[atIndex] = newTextData
    return data
  }

  const update = (atIndex: number, newTextData: TextData[]) => {
    setData(prev => {
      updateTextData(atIndex, prev, newTextData)
      return prev
    })
    props.onChange$(data())
  }

  const addNewItem = () => {
    setData(prev => {
      const items = prev.items

      items.push([DEFAULT_TEXT_DATA])
      return { ...prev, items }
    })
    props.onChange$(data())
  }

  const deleteItem = (atIndex: number) => {
    setData(prev => {
      const items = arrayObjects(prev.items).removeByIndex$(atIndex)
      return { ...prev, items }
    })
    props.onChange$(data())
  }

  return (
    <Context.Provider value={{
      addItem$: addNewItem,
      deleteItem$: deleteItem,
      updateItem$: update,
      data$: data
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useListDataContext() {
  return useContext(Context)!
}