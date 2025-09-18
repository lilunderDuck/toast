import packageJson from "../../package.json" with { type: "json" }
// ...
// @ts-ignore
import { encodeUrl } from "https://deno.land/x/encodeurl@1.0.0/mod.ts"
import fs from "node:fs"
import path from "node:path"

type NpmRegistryVersion = {
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

type NpmRegistryResponse = {
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

type LibaryData = {
  id: number
  name: string
  description: string
  maintainers: number
  author: {
    url?: string
    name: string
  }
  license: string
  homepage: string
  version: number[]
}

let currentId = 0
const DATA_OUT: LibaryData[] = []
async function fetchNpmRegistry(
  packageName: string, 
  packageVersion: string, 
  type: number,
) {
  try {
    console.log('Fetching', packageName)
    const response = await fetch(`https://registry.npmjs.org/${encodeUrl(packageName)}`)
    const metadata: NpmRegistryResponse = await response.json()

    const data = {
      name: packageName,
      author: metadata.author,
      version: packageVersion.replace("^", "").split('.').map(it => parseInt(it)),
      description: metadata.description,
      homepage: metadata.homepage,
      type,
      id: currentId
    }

    console.log(typeof metadata.author)
    if (typeof metadata.author === "string") {
      data.author = {
        name: metadata.author
      }
    }

    DATA_OUT.push(data)

    currentId += 1
  } catch(it) {
    console.error(it)
  }
}

try {
  if (
    fs.existsSync(path.join(import.meta.dirname, "./lib_used.json"))
  ) {
    process.exit()
  }
} catch (error) {
  console.error(error)
}

for (const [packageName, packageVersion] of Object.entries(packageJson.dependencies)) {
  await fetchNpmRegistry(packageName, packageVersion, 0)
}

for (const [packageName, packageVersion] of Object.entries(packageJson.devDependencies)) {
  await fetchNpmRegistry(packageName, packageVersion, 1)
}

fs.writeFileSync(path.join(import.meta.dirname, "./lib_used.json"), JSON.stringify(DATA_OUT))