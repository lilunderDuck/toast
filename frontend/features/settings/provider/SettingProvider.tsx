import { type Accessor, createContext, createSignal, type JSX, lazy, type ParentProps, type Setter, useContext } from "solid-js"
import { type IconTypes } from "solid-icons"
import { createStore } from "solid-js/store"
import { createLazyLoadedDialog } from "~/hooks"
import { DEBUG_INFO_LABEL } from "macro-def"

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
  showSettingDialog$(): void
}

const Context = createContext<ISettingContext<{}>>()

export interface ISettingProviderProps<T> {
}

export function SettingProvider<T extends {}>(props: ParentProps<ISettingProviderProps<T>>) {
  const [currentPage, setCurrentPage] = createSignal('')
  const [config, setConfig] = createSignal({})

  const { Dialog$, show$ } = createLazyLoadedDialog(
    () => import("../dialog/MainSettingDialog"),
    () => ({

    })
  )

  // setCurrentPage(props.config$[0].items$[0].pageId$) // first page
  
  return (
    <Context.Provider value={{
      config$: [],
      pages$: {},
      currentPage$: currentPage,
      // @ts-ignore
      data$: createStore<T>(props.data$),
      setCurrentPage$(value) {
        DEBUG_INFO_LABEL("setting", "switch to page:", value)
        return setCurrentPage(value)
      },
      showSettingDialog$: show$
    }}>
      {props.children}
      <Dialog$ />
    </Context.Provider>
  )
}

export function useSettingContext<T extends {}>() {
  console.assert(useContext(Context), "you must wrap your component with <SettingProvider /> in order to use useSettingContext()")
  return useContext<ISettingContext<T>>(Context as any)!
}