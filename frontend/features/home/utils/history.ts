import { DEBUG_ASSERT, DEBUG_INFO_LABEL } from "macro-def"

export function createHistory() {
  let routeItems: string[] = []
  let currentRouteIndex = 0

  return {
    add$(route: string) {
      if (routeItems.includes(route)) {
        DEBUG_INFO_LABEL("global/history", "already included route:", route)
        return
      }
      routeItems.push(route)
      DEBUG_INFO_LABEL("global/history", "adding route to history:", route)
    },
    back$() {
      if (currentRouteIndex == 0) return
      currentRouteIndex -= 1
      DEBUG_ASSERT(routeItems[currentRouteIndex], "route item index out of bound for index:", currentRouteIndex)
      return routeItems[currentRouteIndex]
    },
    next$() {
      if (currentRouteIndex >= routeItems.length) return
      currentRouteIndex += 1
      DEBUG_ASSERT(routeItems[currentRouteIndex], "route item index out of bound for index:", currentRouteIndex)
      return routeItems[currentRouteIndex]
    },
  }
}

export type HistoryHandler = ReturnType<typeof createHistory>