import packageJson from "../../package.json" with { type: "json" }
import { encodeUrl } from "https://deno.land/x/encodeurl@1.0.0/mod.ts"
import { NpmRegistryResponse } from "./npm.ts"
import type { OverSimpifiedNpmRegistryData } from "../../src/api/misc/index.ts"

async function fetchNpmRegistry(
  packageName: string, 
  packageVersion: string, 
  type: OverSimpifiedNpmRegistryData["type"],
  out: OverSimpifiedNpmRegistryData[]
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
  const stuff: OverSimpifiedNpmRegistryData[] = []
  const deps = Object.entries(packageJson.dependencies)
  const devDeps = Object.entries(packageJson.devDependencies)
  
  for (const [packageName, packageVersion] of deps) {
    await fetchNpmRegistry(packageName, packageVersion, 'dep', stuff)
  }

  for (const [packageName, packageVersion] of devDeps) {
    await fetchNpmRegistry(packageName, packageVersion, 'devDep', stuff)
  }

  return stuff
}