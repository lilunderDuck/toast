import { createContext, createSignal, type ParentProps, useContext, type Accessor, onMount } from "solid-js"

interface IAudioContext {
  progress$: Accessor<number>
  audioTimeUpdate$: EventHandler<"audio", "onTimeUpdate">
  data$: () => any
}

const Context = createContext<IAudioContext>()

export function AudioProvider(props: ParentProps) {
  const [progress, setProgress] = createSignal(0)
  const [data, setData] = createSignal(null)

  const audioTimeUpdate: IAudioContext["audioTimeUpdate$"] = (updateEvent) => {
    setProgress(updateEvent.timeStamp)
  }

  onMount(async() => {
    setData(null)
  })

  return (
    <Context.Provider value={{
      progress$: progress,
      audioTimeUpdate$: audioTimeUpdate,
      data$: data
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useAudioContext() {
  return useContext(Context)!
}