export type OverSimpifiedNpmRegistryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  tags: string[]
}

export type LibaryUsedData = OverSimpifiedNpmRegistryData[]