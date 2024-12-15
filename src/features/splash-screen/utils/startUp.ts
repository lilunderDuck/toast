// import { 
//   JournalApi,
//   JOURNAL_GROUP_ROUTE
// } from "~/api"
import { SplashScreen } from "../components"
// import { fetchIt } from "./fetching"
import { sleep } from "~/utils"

export async function fetchStuffFromServer() {
  let journalGroups
  const checkList = [
    // {
    //   msg: 'Check if server is alive or not',
    //   async run() {
    //     const stuff = await fetchIt('GET', '/ping')
    //     if (!stuff) {
    //       throw 'App panic'
    //     }
    //   }
    // },
    {
      msg: 'Lift off!',
      async run() {
        await sleep(500)
      }
    }
  ]

  console.log('[make toast] fetching start')
  console.time('[make toast] fetching finished')
  const totalTasks = checkList.length
  console.log('total task', totalTasks)

  const tasking = async(current: number) => {
    if (current > totalTasks) return
    const task = checkList[current]

    SplashScreen.$setProgress(((current + 1) / totalTasks) * 100)
    SplashScreen.$setText(task.msg)
    await task.run()
    await sleep(1000)
    return tasking(current + 1)
  }
  
  await sleep(1000)
  await tasking(0)
  
  // just in case I messed up something... 
  console.assert(journalGroups !== null, "journal group should not return null, if there's none, return an empty array instead...")

  console.timeEnd('[make toast] fetching finished')
}