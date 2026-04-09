import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"

interface IJournalHomeRootContext {
  currentPage$: Accessor<JournalPage>
  _setCurrentPage$: Setter<JournalPage>
}

const Context = createContext<IJournalHomeRootContext>()

interface IJournalHomeRootProviderProps {
}

export function JournalHomeRootProvider(props: ParentProps<IJournalHomeRootProviderProps>) {
  const [currentPage, setCurrentPage] = createSignal<JournalPage>(JournalPage.JOURNAL_HOME)

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