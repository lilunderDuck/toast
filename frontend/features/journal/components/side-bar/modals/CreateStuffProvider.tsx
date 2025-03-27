import { createContext, createSignal, useContext, type ParentProps, type Signal } from "solid-js"
import type { JournalFileType } from "~/api/journal"

interface ICreateStuffContext {
  $submitButtonDisabled: Signal<boolean>
  $selected: Signal<JournalFileType | undefined>
}

const Context = createContext<ICreateStuffContext>()

export function CreateStuffProvider(props: ParentProps) {
  return (
    <Context.Provider value={{
      $submitButtonDisabled: createSignal(true),
      $selected: createSignal()
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useCreateStuffContext = () => useContext(Context)!