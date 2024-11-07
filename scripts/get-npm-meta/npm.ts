export type NpmRegistryVersion = {
  name: string
  description: string
  author: {
    name: string
  }
  license: string
  version: string
  homepage: string
  repository: {
    type: string
    url: string
  }
  // ... more ...
}

type Maintainer = {
  name: string
  email: string
}

export type NpmRegistryResponse = {
  _id: string
  _rev: string
  name: string
  'dist-tag': Record<string, string>
  versions: Record<string, NpmRegistryVersion>
  time: Record<string, Date> & {
    created: Date
    modified: Date
  }
  maintainers: Maintainer[]
  description: string
  homepage: string
  keywords: string[]
  repository: {
    type: string
    url: string
  }
  author: {
    name: string
  }
  bugs: {
    name: string
  }
  license: string
  readme: string
}