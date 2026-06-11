import { DEBUG_INFO_LABEL } from "macro-def"
import type { IconTypes } from "solid-icons"
import { createContext, createEffect, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { usePersistedSignal } from "~/hooks"

type PageId = "notes_page$" | "collection_page$" | "sticky_note_page$"

interface IMainPageContext {
  currentPage$: Accessor<PageId>
  _setCurrentPage$: Setter<PageId>
  isShowingSidebar$: Accessor<boolean>
  _setIsShowingSidebar$: Setter<boolean>
}

export interface IPageData {
  name$: string
  icon$: IconTypes
  pageId$: PageId
}

const Context = createContext<IMainPageContext>()

interface IMainPageProviderProps {
}

export function MainPageProvider(props: ParentProps<IMainPageProviderProps>) {
  const [currentPage, setCurrentPage] = usePersistedSignal<PageId>(sessionStorage, "home_last_page", "notes_page$")
  const [isShowingSidebar, setIsShowingSidebar] = usePersistedSignal(localStorage, "home_show_sidebar", true)

  if (TOAST_DEBUG) {
    createEffect(() => {
      DEBUG_INFO_LABEL("home", "going to page:", currentPage())
    })
  }

  createEffect(() => {
    const shouldShowSidebar = isShowingSidebar()
    if (shouldShowSidebar) {
      document.body.classList.remove('journalHome__sidebar_hidden')
    } else {
      document.body.classList.add('journalHome__sidebar_hidden')
    }
  })

  return (
    <Context.Provider value={{
      currentPage$: currentPage,
      _setCurrentPage$: setCurrentPage,
      isShowingSidebar$: isShowingSidebar, 
      _setIsShowingSidebar$: setIsShowingSidebar
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useMainPageContext() {
  return useContext(Context)!
}