import { createContext, type ParentProps, useContext } from "solid-js"
import { createStore, Store, SetStoreFunction } from "solid-js/store"
// ...
import type { IVideoBlockData } from "~/features/editor/common/video"

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