import type { IconTypes } from "solid-icons"
import { createContext, createEffect, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { usePersistedSignal } from "~/hooks"

type JournalPageId = "journal_page$" | "collection_page$" | "sticky_note_page$"

interface IJournalHomeRootContext {
  currentPage$: Accessor<JournalPageId>
  _setCurrentPage$: Setter<JournalPageId>
  isShowingSidebar$: Accessor<boolean>
  _setIsShowingSidebar$: Setter<boolean>
}

export interface IJournalHomePageData {
  name$: string
  icon$: IconTypes
  pageId$: JournalPageId
}

const Context = createContext<IJournalHomeRootContext>()

interface IJournalHomeRootProviderProps {
}

export function JournalHomeRootProvider(props: ParentProps<IJournalHomeRootProviderProps>) {
  const [currentPage, setCurrentPage] = usePersistedSignal<JournalPageId>(sessionStorage, "home_last_page", "journal_page$")
  const [isShowingSidebar, setIsShowingSidebar] = usePersistedSignal(localStorage, "home_show_sidebar", true)

  createEffect(() => {
    const shouldShowSidebar = isShowingSidebar()
    document.body.setAttribute("data-journal-home-show-sidebar", `${shouldShowSidebar}`)
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

export function useJournalHomeRootContext() {
  return useContext(Context)!
}