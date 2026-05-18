import { defineMacroProvider, vitePluginMacro } from "vite-plugin-macro"
import { join } from "node:path"
import { randomString, className } from "./core"

export const MACRO_EXPORTS = {
  'macro-def': {
    macros: [
      className,
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