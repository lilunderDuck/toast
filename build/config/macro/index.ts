import { defineMacroProvider, vitePluginMacro } from "vite-plugin-macro";
import { join } from "node:path"
import { mergeClassnames } from "./mergeClassnames";

export const macroPlugin = vitePluginMacro({
  typesPath: join(__dirname, "./macro_def.d.ts"),
})
  .use(defineMacroProvider({
    id: 'idk man',
    exports: {
      'macro-def': {
        macros: [mergeClassnames],
      }
    },
  }))
  .toPlugin()
// ...