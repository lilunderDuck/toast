import { Accessor, createContext, ParentProps, useContext } from "solid-js"
import { IVideoBlockData } from "./data"
import { createStore, Store, SetStoreFunction } from "solid-js/store"

interface IVideoDataContext {
  data$: Store<IVideoBlockData>
  setData$: SetStoreFunction<IVideoBlockData>
}

interface IVideoDataProviderProps {
  dataIn$: IVideoBlockData
  onChange$(data: IVideoBlockData): void
}

const Context = createContext<IVideoDataContext>()

export function VideoDataProvider(props: ParentProps<IVideoDataProviderProps>) {
  const [data, setData] = createStore(props.dataIn$)

  return (
    <Context.Provider value={{
      data$: data,
      setData$: setData
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useVideoDataContext() {
  return useContext(Context)!
}