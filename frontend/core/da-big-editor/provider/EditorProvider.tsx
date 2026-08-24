import { Crepe } from "@milkdown/crepe"
import { createContext, onCleanup, ParentProps, useContext } from "solid-js"

interface IEditorContext {
  instance$: Crepe
}

const Context = createContext<IEditorContext>()

interface IEditorProviderProps {
  // ...
}

export function EditorProvider(props: ParentProps<IEditorProviderProps>) {
  const crepe = new Crepe({
    root: '#editor__main',
    defaultValue: 'Hello, Milkdown!',
  })
  
  onCleanup(() => {
    crepe.destroy()
  })

  return (
    <Context.Provider value={{
      instance$: crepe
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useEditorContext() {
  return useContext(Context)!
}