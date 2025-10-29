import { createContext, createSignal, ParentProps, useContext, type Accessor, type Setter } from "solid-js"

interface IJournalContentPanelContext {
  currentlyOpenedJournal$: Accessor<string | undefined>
  setCurrentlyOpenedJournal$: Setter<string | undefined>
}

const Context = createContext<IJournalContentPanelContext>()

interface IJournalContentPanelProviderProps {
  tabPanelId$: string
}

export function JournalContentPanelProvider(props: ParentProps<IJournalContentPanelProviderProps>) {
  const [currentlyOpenedJournal, setCurrentlyOpenedJournal] = createSignal<string>()

  return (
    <Context.Provider value={{
      currentlyOpenedJournal$: currentlyOpenedJournal,
      setCurrentlyOpenedJournal$: setCurrentlyOpenedJournal
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useJournalContentPanelContext() {
  return useContext(Context)!
}