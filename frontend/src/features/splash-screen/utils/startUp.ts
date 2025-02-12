import { fetchIt, sleep } from "~/utils"
// ...
import { SplashScreen } from "../components"
import { createTimer } from "./timer"

const enum TaskResult {
  retry
}

type TaskRunResult = void | TaskResult

interface ITaskOptions {
  msg$: string
  run(): Promise<TaskRunResult>
}

export async function fetchStuffFromServer() {
  const checkList: ITaskOptions[] = [
    {
      msg$: 'Make sure the server is up.',
      async run() {
        if (await fetchIt("GET", "/ping")) {
          return
        }

        return TaskResult.retry
      }
    },
    {
      msg$: 'Lift off!',
      async run() {
        await sleep(1500)
      }
    }
  ]

  console.log('[make toast] fetching start')
  console.time('make toast')
  const totalTasks = checkList.length
  console.log('total task', totalTasks)

  let retryTimer = 3000
  const tasking = async(current: number) => {
    if (current > totalTasks) return

    const currentTask = checkList[current]

    SplashScreen.setProgress$(((current + 1) / totalTasks) * 100)
    SplashScreen.setText$(`(${current + 1} / ${totalTasks}) ${currentTask.msg$}`)
    const result = await currentTask.run()
    switch (result) {
      case TaskResult.retry:
        await showTheCurrentTaskShouldRetry(retryTimer, currentTask)
        retryTimer += 2000
        return tasking(current) // retry current task again
      default:
        return tasking(current + 1) // to the next task
    }
  }
  
  await tasking(0) // first task

  console.timeEnd('make toast')
}

async function showTheCurrentTaskShouldRetry(retry: number, currentTask: ITaskOptions) {
  console.log(`Retrying task "${currentTask.msg$}" after`, retry / 1000, 'seconds')

  const timer = createTimer('decrease', retry / 1000, 0.5)
  timer.onUpdate((currentTimeInSeconds) => {
    SplashScreen.setText$(`${currentTask.msg$} (Retrying after ${currentTimeInSeconds} seconds)`)
  })

  timer.start$()
  await sleep(retry)
  timer.finish$()

  SplashScreen.setText$(currentTask.msg$)
}