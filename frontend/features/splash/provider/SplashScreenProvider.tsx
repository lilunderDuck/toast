import { createContext, createSignal, onMount, ParentProps, Show, useContext, type Accessor } from "solid-js"
import { sleep } from "~/utils"

interface ISplashScreenContext {
  progress$: Accessor<number>
  hideScreen$(): void
}

const Context = createContext<ISplashScreenContext>()

export function SplashScreenProvider(props: ParentProps) {
  const [isShowing, setIsShowing] = createSignal(true)
  const [progress, setProgress] = createSignal(0)

  const tasking = async() => { 
    // await sleep(getRandomNumberFrom(1000, 2000))
    // setProgress(100)
    // await sleep(1000)
    // setIsShowing(false)
  }

  onMount(() => tasking())
  
  return (
    <Context.Provider value={{
      progress$: progress,
      async hideScreen$() {
        setProgress(100)
        await sleep(1000)
        setIsShowing(false)
      }
    }}>
      <Show when={isShowing()}>
        {props.children}
      </Show>
    </Context.Provider>
  )
}

export function useSplashScreenContext() {
  return useContext(Context)! ?? {
    progress$: () => 50,
    hideScreen$: () => {}
  }
}