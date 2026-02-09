import type { ChainedCommands } from "@tiptap/core"
import { useEditorContext } from "../provider"

export function getCommand<T extends keyof ChainedCommands>(commandName: T) {
  console.assert(useEditorContext(), "callCommand() can only be called inside <EditorProvider />")
  const { editor$ } = useEditorContext()
  return (...args: Parameters<ChainedCommands[T]>) => {
    const command = editor$().chain().focus()[commandName]
    isDevMode && (() => {
      // @ts-ignore - sometime this will be undefined
      if (command) return

      console.error([
        `Could not get command: ${commandName}`,
        "Make sure to check if your extension have that command, example like this:",
        " 1  | export const Node = createEditorNode<...>(..., {",
        " 2  |   // ...",
        " 3  |   commands$() {",
        " 4  |     return {",
        ` 5  |       ${commandName}: () => ({ tr }) => {`,
        " 6  |       // ^^^^^^^^^^^ ",
        " 7  |       },",
        " 8  |     }",
        " 9  |   },",
        " 10 |   View$() {/* ... */}",
        " 11 | })",
        "",
        "If you already have that command in your node, make sure to add it to your extensions list as well.",
        " 1  | ",
        " 2  | export function getExtensions() {",
        " 3  |   const extensions = [",
        " 4  |     // ... extensions list ...",
        " 6  |     Node",
        " 5  |     //^^^ add your extension/node to here",
        " 7  |   ]",
        " 8  | ",
        " 9  |   return extension",
        " 10 | }"
      ].join('\n'))
    })()

    // @ts-ignore - very nasty code
    return (command(...args) as ChainedCommands).focus()
  }
}