import { 
  LIBARY_USED_ROUTE, 
  MEMORY_USAGE_ROUTE, 
  type OverSimpifiedNpmRegistryData,
  type IServerResourceUsage 
} from "~/api/misc"
import { fetchIt } from "~/utils"

export async function api_getServerUsages() {
  return await fetchIt('GET', MEMORY_USAGE_ROUTE) as IServerResourceUsage
}

export async function api_getLibariesUsed() {
  return await fetchIt('GET', LIBARY_USED_ROUTE) as OverSimpifiedNpmRegistryData[]
}