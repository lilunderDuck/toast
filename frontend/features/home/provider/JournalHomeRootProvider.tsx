import { createContext, createEffect, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { usePersistedSignal } from "~/hooks"

interface IJournalHomeRootContext {
  currentPage$: Accessor<JournalPage>
  _setCurrentPage$: Setter<JournalPage>
  isShowingSidebar$: Accessor<boolean>
  _setIsShowingSidebar$: Setter<boolean>
}

const Context = createContext<IJournalHomeRootContext>()

interface IJournalHomeRootProviderProps {
}

export function JournalHomeRootProvider(props: ParentProps<IJournalHomeRootProviderProps>) {
  const [currentPage, setCurrentPage] = usePersistedSignal<JournalPage>(sessionStorage, "home_last_page", JournalPage.JOURNAL_HOME)
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