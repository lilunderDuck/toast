export type OverSimpifiedNpmRegistryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  type: 'dep' | 'devDep'
}

export type LibaryUsedData = OverSimpifiedNpmRegistryData[]

export const enum LibaryType {
  frontend,
  backend,
  build
}