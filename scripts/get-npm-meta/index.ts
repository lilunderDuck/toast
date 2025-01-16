import packageJson from "../../package.json" with { type: "json" }
import { encodeUrl } from "https://deno.land/x/encodeurl@1.0.0/mod.ts"
import { NpmRegistryResponse } from "./npm.ts"

type OverSimpifiedNpmRegistryData = {
  name: string
  author?: string
  version: string
  description: string
  homepageUrl: string
  tags: string[]
}

async function fetchNpmRegistry(packageName: string, packageVersion: string, out: OverSimpifiedNpmRegistryData[]) {
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
      tags: metadata.keywords
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
  const stuff: OverSimpifiedNpmRegistryData[] = []
  const things = [
    ...Object.entries(packageJson.dependencies),
    ...Object.entries(packageJson.devDependencies)
  ]
  
  for (const [packageName, packageVersion] of things) {
    await fetchNpmRegistry(packageName, packageVersion, stuff)
  }

  return stuff
}