import { defineMacroProvider, vitePluginMacro } from "vite-plugin-macro"
import { join } from 'node:path'
// ...
import { urlBuilder } from "./urlBuilder"

export const macroPlugin = vitePluginMacro({
  typesPath: join(__dirname, "./types.d.ts"),
})
  .use(defineMacroProvider({
    id: 'idk man',
    exports: {
      'macro_def': {
        macros: [urlBuilder]
      }
    },
  }))
  .toPlugin()
// ...