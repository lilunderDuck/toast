import packageJson from "../../frontend/package.json" with { type: "json" }
import type { LibaryData } from "../../frontend/src/api/misc"
// ...
// @ts-ignore
import { encodeUrl } from "https://deno.land/x/encodeurl@1.0.0/mod.ts"
import fs from "node:fs"

async function fetchNpmRegistry(
  packageName: string, 
  packageVersion: string, 
  type: LibaryData["type"],
  out: LibaryData[]
) {
  try {
    console.log('Fetching', packageName)
    const response = await fetch(`https://registry.npmjs.org/${encodeUrl(packageName)}`)
    const metadata: NpmRegistryResponse = await response.json()

    out.push({
      name: packageName,
      author: metadata.author?.name,
      version: packageVersion,
      description: metadata.description,
      homepageUrl: metadata.homepage,
      type
    })
  } catch(it) {
    console.error(it)
  }
}

/**Fetch all package informations inside `package.json`, both of the `dependencies` and `devDependencies`.
 * 
 * Before you scream at me, this function is poorly optimized.
 * @returns all package informations.
 */
export async function fetchNpmData() {
  const stuff: LibaryData[] = []
  const deps = Object.entries(packageJson.dependencies)
  const devDeps = Object.entries(packageJson.devDependencies)
  
  for (const [packageName, packageVersion] of deps) {
    await fetchNpmRegistry(packageName, packageVersion, 'dep', stuff)
  }

  for (const [packageName, packageVersion] of devDeps) {
    await fetchNpmRegistry(packageName, packageVersion, 'devDep', stuff)
  }

  console.log(stuff)

  return stuff
}

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

fs.writeFileSync("lib_used.json", JSON.stringify(await fetchNpmData()))