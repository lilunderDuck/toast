import { type Accessor, createContext, createSignal, type JSX, lazy, type ParentProps, type Setter, useContext } from "solid-js"
import { IconTypes } from "solid-icons"
// ...

export interface ISettingConfig {
  label$: JSX.Element
  items$: {
    name$: JSX.Element
    icon$: IconTypes
    pageId$: string
  }[]
}

type SettingPageMapping = Record<string, ReturnType<typeof lazy>>

interface ISettingContext {
  config$: ISettingConfig[]
  pages$: SettingPageMapping
  currentPage$: Accessor<string>
  setCurrentPage$: Setter<string>
}

const Context = createContext<ISettingContext>()

export interface ISettingProviderProps {
  config$: ISettingConfig[]
  pages$: SettingPageMapping
}

export function SettingProvider(props: ParentProps<ISettingProviderProps>) {
  const [currentPage, setCurrentPage] = createSignal('')

  setCurrentPage(props.config$[0].items$[0].pageId$) // first page
  
  return (
    <Context.Provider value={{
      config$: props.config$,
      pages$: props.pages$,
      currentPage$: currentPage,
      // @ts-ignore
      setCurrentPage$(value) {
        console.log("page switch to", value)
        return setCurrentPage(value)
      }
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useSettingContext() {
  return useContext(Context)!
}