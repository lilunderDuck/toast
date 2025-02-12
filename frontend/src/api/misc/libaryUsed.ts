export type LibaryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  type: 'dep' | 'devDep'
}

export type LibaryUsedData = LibaryData[]

export const enum LibaryType {
  frontend,
  backend,
  build
}