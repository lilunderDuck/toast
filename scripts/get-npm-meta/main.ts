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

const stuff: OverSimpifiedNpmRegistryData[] = []
const otherStuff: OverSimpifiedNpmRegistryData[] = []
async function fetchNpmRegistry(packageName: string, packageVersion: string, out: OverSimpifiedNpmRegistryData[]) {
  try {
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

for (const [packageName, packageVersion] of Object.entries(packageJson.dependencies)) {
  await fetchNpmRegistry(packageName, packageVersion, stuff)
}

for (const [packageName, packageVersion] of Object.entries(packageJson.devDependencies)) {
  await fetchNpmRegistry(packageName, packageVersion, otherStuff)
}

const encoder = new TextEncoder()
const data = encoder.encode(JSON.stringify({
  deps: stuff,
  devDeps: otherStuff
}))
Deno.writeFile('./generated.json', data)