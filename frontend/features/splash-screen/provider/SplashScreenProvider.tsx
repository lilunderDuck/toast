import { createContext, createSignal, onMount, ParentProps, Show, useContext, type Accessor } from "solid-js"
import { getRandomNumberFrom, sleep } from "~/utils"

interface ISplashScreenContext {
  progress$: Accessor<number>
}

const Context = createContext<ISplashScreenContext>()

interface ISplashScreenProviderProps {
  // insert your context props here
}

export function SplashScreenProvider(props: ParentProps) {
  const [isShowing, setIsShowing] = createSignal(true)
  const [progress, setProgress] = createSignal(0)

  const tasking = async() => {
    await sleep(getRandomNumberFrom(2000, 6000))
    setProgress(100)
    await sleep(1000)
    setIsShowing(false)
  }

  onMount(() => tasking())
  
  return (
    <Context.Provider value={{
      progress$: progress
    }}>
      <Show when={isShowing()}>
        {props.children}
      </Show>
    </Context.Provider>
  )
}

export function useSplashScreenContext() {
  return useContext(Context)!
}