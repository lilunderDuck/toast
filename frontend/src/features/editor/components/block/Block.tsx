import { createContext, ParentProps, useContext } from "solid-js"

interface IBlockContext {
  blockId$: number
}

const Context = createContext<IBlockContext>()

function BlockProvider(props: ParentProps<IBlockContext>) {
  return (
    <Context.Provider value={{
      blockId$: props.blockId$
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useBlockContext() {
  return useContext(Context)!
}

export function Block(props: ParentProps<IBlockContext>) {
  return (
    <BlockProvider blockId$={props.blockId$}>
      {props.children}
    </BlockProvider>
  )
}