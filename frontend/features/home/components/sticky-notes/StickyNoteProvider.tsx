import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"

export interface IStickyNoteContext {
  color$: Accessor<string>
  setColor$: Setter<string>
  buttonRowShouldAlwaysShow$: Accessor<boolean>
  setButtonRowShouldAlwaysShow$: Setter<boolean>
  data$: Accessor<IStickyNoteProviderProps["data$"]>
  updateData$: (newData: Partial<IStickyNoteProviderProps["data$"]>) => void
}

const Context = createContext<IStickyNoteContext>()

interface IStickyNoteProviderProps {
  data$: {
    title: string
    content: string
    color?: string
  }
}

export function StickyNoteProvider(props: ParentProps<IStickyNoteProviderProps>) {
  const [color, setColor] = createSignal(props.data$.color ?? "#313244")
  const [data, setData] = createSignal<IStickyNoteProviderProps["data$"]>(props.data$)
  const [buttonRowShouldAlwaysShow, setButtonRowShouldAlwaysShow] = createSignal(false)

  return (
    <Context.Provider value={{
      color$: color,
      setColor$: setColor,
      buttonRowShouldAlwaysShow$: buttonRowShouldAlwaysShow,
      setButtonRowShouldAlwaysShow$: setButtonRowShouldAlwaysShow,
      data$: data,
      updateData$(newData) {
        const data = setData(prev => ({ ...prev, ...newData }))
        // TODO: save data
      },
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useStickyNoteContext() {
  return useContext(Context)!
}