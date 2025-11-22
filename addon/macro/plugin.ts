import { defineMacroProvider, vitePluginMacro } from "vite-plugin-macro"
import { join } from "node:path"
import { mergeClassnames, getValueOrDefault, escapeCssUrl, randomString } from "./core"

export const MACRO_EXPORTS = {
  'macro-def': {
    macros: [
      mergeClassnames, 
      getValueOrDefault, 
      escapeCssUrl, 
      randomString
    ],
  }
}

export const macroPlugin = vitePluginMacro({
  typesPath: join(import.meta.dirname, "../../build/dist/macro_def.d.ts"),
})
  .use(defineMacroProvider({
    id: 'idk man',
    exports: MACRO_EXPORTS,
  }))
  .toPlugin()
// ...