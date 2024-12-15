import { MEMORY_USAGE_ROUTE, type IServerResourceUsage } from "~/api/misc"
import { fetchIt } from "~/utils"

export async function getServerUsages() {
  return await fetchIt('GET', MEMORY_USAGE_ROUTE) as IServerResourceUsage
}