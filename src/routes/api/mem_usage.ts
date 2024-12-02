import { type IServerResourceUsage, MEMORY_USAGE_ROUTE } from "~/api"
import { duck } from "~/entry-server"
// import os from 'node:os'

const formatMemoryUsage = (data: number) => Math.round(data / 1024 / 1024 * 100) / 100

const startTime  = process.hrtime()
const startUsage = process.cpuUsage()
duck.get(MEMORY_USAGE_ROUTE, async(context) => {
  const memUsage = process.memoryUsage()

  const elapTime = process.hrtime(startTime)
  const elapUsage = process.cpuUsage(startUsage)

  const elapTimeMS = secNSec2ms(elapTime)
  const elapUserMS = secNSec2ms(elapUsage.user)
  const elapSystMS = secNSec2ms(elapUsage.system)
  const cpuPercent = Math.round(100 * (elapUserMS + elapSystMS) / elapTimeMS)

  console.log('elapsed time ms:  ', elapTimeMS)
  console.log('elapsed user ms:  ', elapUserMS)
  console.log('elapsed system ms:', elapSystMS)
  console.log('cpu percent:      ', cpuPercent)

  function secNSec2ms (secNSec: number | [number, number]) {
    if (Array.isArray(secNSec)) { 
      return secNSec[0] * 1000 + secNSec[1] / 1000000; 
    }
    return secNSec / 1000; 
  }

  return context.json({
    totalHeap: formatMemoryUsage(memUsage.heapTotal),
    heapUsed: formatMemoryUsage(memUsage.heapUsed),
  } as IServerResourceUsage, 200)
})