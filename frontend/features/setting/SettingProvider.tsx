import { type Accessor, createContext, createSignal, type JSX, lazy, type ParentProps, type Setter, useContext } from "solid-js"
import { type IconTypes } from "solid-icons"
import { createStore } from "solid-js/store"

export interface ISettingConfig {
  label$: JSX.Element
  items$: {
    name$: JSX.Element
    icon$: IconTypes
    pageId$: string
  }[]
}

type SettingPageMapping = Record<string, ReturnType<typeof lazy>>

interface ISettingContext<T extends {}> {
  config$: ISettingConfig[]
  pages$: SettingPageMapping
  currentPage$: Accessor<string>
  setCurrentPage$: Setter<string>
  data$: ReturnType<typeof createStore<T>>
}

const Context = createContext<ISettingContext<{}>>()

export interface ISettingProviderProps<T> {
  config$: ISettingConfig[]
  pages$: SettingPageMapping
  data$: T
}

export function SettingProvider<T extends {}>(props: ParentProps<ISettingProviderProps<T>>) {
  const [currentPage, setCurrentPage] = createSignal('')

  setCurrentPage(props.config$[0].items$[0].pageId$) // first page
  
  return (
    <Context.Provider value={{
      config$: props.config$,
      pages$: props.pages$,
      currentPage$: currentPage,
      // @ts-ignore
      data$: createStore<T>(props.data$),
      setCurrentPage$(value) {
        console.log("page switch to", value)
        return setCurrentPage(value)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useSettingContext<T extends {}>() {
  // unsafe type casting
  return useContext<ISettingContext<T>>(Context as any)!
}