export type VideoAttribute = {
  path: string
}

export type VideoDurationData = Partial<{
  totalDuration$: number
  currentDuration$: number
}>