import tsconfig from '../../tsconfig.json'
import path from 'node:path'

export function getAliasPath(basePath: string) {
  const configuredPath = tsconfig.compilerOptions.paths
  const alias: Record<string, string> = {}
  
  for (let [pathAlias, acturalPath] of Object.entries(configuredPath)) {
    if (acturalPath.length > 1) {
      throw 'panic: alias path should not have more than 1 actural path'
    }
    pathAlias = pathAlias.replace('/*', '')
    acturalPath = acturalPath.map(it => (
      path.resolve(basePath, it.replace('/*', ''))
    ))

    alias[pathAlias] = acturalPath.join('')
    console.log(pathAlias, '\twill be resolved to', acturalPath)
  }

  return alias
}