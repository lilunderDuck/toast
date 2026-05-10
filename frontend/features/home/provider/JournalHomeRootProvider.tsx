import { createContext, createEffect, createSignal, onMount, ParentProps, useContext, type Accessor, type Setter } from "solid-js"
import { createStorage } from "~/utils"

interface IJournalHomeRootContext {
  currentPage$: Accessor<JournalPage>
  _setCurrentPage$: Setter<JournalPage>
}

const Context = createContext<IJournalHomeRootContext>()

interface IJournalHomeRootProviderProps {
}

export function JournalHomeRootProvider(props: ParentProps<IJournalHomeRootProviderProps>) {
  const [currentPage, setCurrentPage] = createSignal<JournalPage>(JournalPage.JOURNAL_HOME)
  const wrappedSessionStorage = createStorage<{
    home_last_page: number
  }>(sessionStorage)

  onMount(() => {
    const lastPage = wrappedSessionStorage.get$("home_last_page") ?? JournalPage.JOURNAL_HOME
    setCurrentPage(lastPage)
  })

  createEffect(() => {
    wrappedSessionStorage.set$('home_last_page', currentPage())
  })

  return (
    <Context.Provider value={{
      currentPage$: currentPage,
      _setCurrentPage$: setCurrentPage,
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalHomeRootContext() {
  return useContext(Context)!
}