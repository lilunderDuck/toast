export type SplashTextData = {
  text: string
}

export interface IServerResourceUsage {
  heapUsed: number
  totalHeap: number
}

export type LibaryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  type: LibaryType
}

export type LibaryUsedData = LibaryData[]

export const enum LibaryType {
  frontend,
  backend,
  build,
}