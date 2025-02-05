export type LibaryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  type: 'dep' | 'devDep'
}

export type LibaryUsedData = LibaryData[]

export type CompressedLibaryData = [
  LibaryData["type"],
  LibaryData["name"],
  LibaryData["version"],
  LibaryData["author"],
  LibaryData["homepageUrl"],
  LibaryData["description"],
]

export const enum LibaryType {
  frontend,
  backend,
  build
}