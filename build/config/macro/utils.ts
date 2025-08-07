import type { TemplateLiteral } from "@babel/types";

export const escapeIdentifier = (name: string) => "${" + name + "}"

/**Rebuild string template literal based on ast/node, idk.
 * 
 * When you take "rebuild from scratch" too personally.
 * @param node a `TemplateLiteral` node 
 * @returns the rebuilt string template literal
 */
export function painfullyRebuildTemplateLiteral(node: TemplateLiteral) {
  const stuff = [...(node?.expressions ?? []), ...(node?.quasis ?? [])]
    .sort((first, second) => first.start! - second.start!)
  // ...

  let result = ''
  for (const something of stuff) {
    if (something.type === "TemplateElement") {
      result += something.value.raw
    }

    if (something.type === "Identifier") {
      result += escapeIdentifier(something.name)
    }
  }

  return result
}