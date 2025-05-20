import { createContext, createSignal, type ParentProps, Signal, useContext } from "solid-js"
import { createStore, Store, SetStoreFunction } from "solid-js/store"
// ...
import type { IVideoBlockData } from "~/features/editor/common/video"

interface IVideoDataContext {
  data$: Store<IVideoBlockData>
  setData$: SetStoreFunction<IVideoBlockData>
  currentVideoDuration$: Signal<number>
  currentVideoProgress$: Signal<number>
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
      // @ts-ignore
      setData$(...value) {
        // @ts-ignore
        setData(...value)
        props.onChange$(data)
      },
      currentVideoDuration$: createSignal(0),
      currentVideoProgress$: createSignal(0),
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useVideoDataContext() {
  return useContext(Context)!
}