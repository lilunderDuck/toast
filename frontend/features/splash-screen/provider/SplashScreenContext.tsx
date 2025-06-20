import { type Accessor, createContext, createResource, createSignal, onMount, type ParentProps, type Resource, Setter, useContext } from "solid-js"
// ...
import { sleep } from "~/utils"
// ...
import { createTimer, ITaskOptions, TaskResult } from "../utils"

interface ISplashScreenProviderProps {
  checkList$: ITaskOptions[]
}

export interface ISplashScreenContext {
  progress$: Accessor<number>
  topText$: Accessor<string>
  isVisible$: Accessor<boolean>
  setIsVisible$: Setter<boolean>
  start$: Resource<void>
}

const Context = createContext<ISplashScreenContext>()

export function SplashScreenProvider(props: ParentProps<ISplashScreenProviderProps>) {
  const [progress, setProgress] = createSignal(0)
  const [text, setText] = createSignal('')
  const [isVisible, setIsVisible] = createSignal(true)

  let retryTimer = 3000
  const TOTAL_TASKS = props.checkList$.length
  const tasking = async(current: number) => {
    if (current > TOTAL_TASKS) return

    const currentTask = props.checkList$[current - 1]
    setProgress(((current + 1) / TOTAL_TASKS) * 100)
    setText(`(${current + 1} / ${TOTAL_TASKS}) ${currentTask.msg$}`)

    const result = await currentTask.run()
    switch (result) {
      case TaskResult.RETRY:
        await retryLater(retryTimer, currentTask)
        retryTimer += 2000
        return tasking(current) // retry current task again
      default:
        return tasking(current + 1) // to the next task
    }
  }

  const retryLater = async(retry: number, currentTask: ITaskOptions) => {
    console.log(`Retrying task "${currentTask.msg$}" after`, retry / 1000, 'seconds')
  
    const timer = createTimer('decrease', retry / 1000, 0.5)
    timer.onUpdate((currentTimeInSeconds) => {
      setText(`${currentTask.msg$} (Retrying after ${currentTimeInSeconds} seconds)`)
    })
  
    timer.start$()
    await sleep(retry)
    timer.finish$()
  
    setText(currentTask.msg$)
  }

  const [resource] = createResource(() => tasking(1))

  return (
    <Context.Provider value={{
      progress$: progress,
      topText$: text,
      isVisible$: isVisible,
      setIsVisible$: setIsVisible,
      start$: resource
    }}>
      {props.children}
    </Context.Provider>
  )
}

export function useSplashScreenContext() {
  return useContext(Context)!
}