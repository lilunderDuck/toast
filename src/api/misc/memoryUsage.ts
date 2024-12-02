import { apiRoute } from "~/common";

export interface IServerResourceUsage {
  heapUsed: number
  totalHeap: number
}

export const MEMORY_USAGE_ROUTE = apiRoute('/mem')
export const SPLASH_TEXT_ROUTE = apiRoute('/splash-text')