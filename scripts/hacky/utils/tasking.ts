export namespace tasking {
  const tasks = [] as { name: string, stuff: AnyFunction }[]
  export function add(name: string, stuff: AnyFunction) {
    tasks.push({ name, stuff })
  } 

  export function run() {
    console.log(`There\'re ${tasks.length} more task(s) to complete the build, so just keep waiting you know?`)
    const runThisTask = async(current: number) => {
      const task = tasks[current]
      if (!task) return
      
      console.groupCollapsed(`Running task #${current + 1} - ${task.name}`)
      await task.stuff()
      console.groupEnd()
      return runThisTask(current + 1)
    }

    runThisTask(0)
  }
}