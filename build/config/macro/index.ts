import { defineMacroProvider, vitePluginMacro } from "vite-plugin-macro"
import { join } from "node:path"
import { mergeClassnames } from "./mergeClassnames"
import { getValueOrDefault } from "./getValueOrDefault"
import { escapeCssUrl } from "./escapeCssUrl"

export const MACRO_EXPORTS = {
  'macro-def': {
    macros: [mergeClassnames, getValueOrDefault, escapeCssUrl],
  }
}

export const macroPlugin = vitePluginMacro({
  typesPath: join(import.meta.dirname, "../../dist/macro_def.d.ts"),
})
  .use(defineMacroProvider({
    id: 'idk man',
    exports: MACRO_EXPORTS,
  }))
  .toPlugin()
// ...