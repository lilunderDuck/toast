export namespace tasking {
  const tasks: AnyFunction[] = []
  export function add(stuff: AnyFunction) {
    tasks.push(stuff)
  } 

  export function run() {
    console.log(`There\'re ${tasks.length} more task(s) to complete the build, so just keep waiting you know?`)
    const runThisTask = async(current: number) => {
      const task = tasks[current]
      if (!task) return
      
      console.log(`Running task #${current + 1}...`)
      await task()
      return runThisTask(current + 1)
    }

    runThisTask(0)
  }
}