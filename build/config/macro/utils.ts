import type { Expression, TemplateLiteral } from "@babel/types";

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

export function getString(node: /*any*/Expression, ignoreUndefined: boolean) {
  switch (node.type) {
    case "TemplateLiteral": return painfullyRebuildTemplateLiteral(node)
    case "Identifier": {
      if (ignoreUndefined && node.name === "undefined") {
        return '' // nothing
      }
      return escapeIdentifier(node.name)
    }
    case "StringLiteral": return node.value

    default:
      throw new Error(`macro_urlBuilder() arg[1]: Case ${node.type} has not been handled yet.`)
  }
}