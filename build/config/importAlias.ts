import path from 'node:path'
import type tsconfig from '../tsconfig.json'

/**Extracts and resolves aliases from a TypeScript configuration file (`tsconfig.json`).
 * ```
 * import tsconfig from 'path/to/tsconfig.json'
 * const aliases = getAliasPath(process.cwd())
 * console.log(aliases)
 * // Output (example):
 * // {
 * //   '@utils': '/path/to/src/utils',
 * //   '@components': '/path/to/src/components'
 * // }
 * ```
 * @param config The tsconfig
 * @param basePath The base path from which to resolve relative paths within aliases.
 * @throws `Error` If an alias configuration contains more than one actual path, because
 * I have absolutely no idea what to do when it has 2 or more path.
 * @returns The resolved alias
 */
export function getAliasPath(config: typeof tsconfig, basePath: string) {
  const configuredPath = config.compilerOptions.paths
  const alias: Record<string, string> = {}
  
  for (let [pathAlias, acturalPath] of Object.entries(configuredPath)) {
    if (acturalPath.length > 1) {
      throw new Error('panic: alias path should not have more than 1 actural path')
    }
    pathAlias = pathAlias.replace('/*', '')
    acturalPath = acturalPath.map(it => (
      path.resolve(basePath, it.replace('/*', ''))
    ))

    alias[pathAlias] = acturalPath.join('')

    // Just gonna console log it out in case it returns some weird result
    console.log(pathAlias, '\twill be resolved to', acturalPath)
  }

  return alias
}