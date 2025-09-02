import { defineMacro } from "vite-plugin-macro"
import type { Expression, ObjectExpression } from "@babel/types"
import * as astring from "astring"
// ...
import { escapeIdentifier, getString } from "./utils"

export const mergeClassnames = defineMacro('macro_mergeClassnames')
  .withSignature('<T extends (string | { class?: string | undefined } | undefined)[]>(...name: T): string', "Merge many class name into a giant class names.")
  .withHandler(({ path, args }, { template }) => {
    const params = args as Expression[]
    let classnames: string[] = []

    for (const prop of params) {
      let value = ''
      // @ts-ignore
      const node = prop.node as Expression

      console.log("hit case ->", prop.type)
      try {
        value = getString(node, true)
      } catch {
        switch (prop.type) {
          case "MemberExpression":
            const code = astring.generate(node)
            if (code === "undefined") {
              continue
            }
            value = escapeIdentifier(code)
          break

          case "CallExpression":
            value = escapeIdentifier(`${astring.generate(node)}.class`)
          break

          case "ObjectExpression":
            value = handleObject(node as ObjectExpression)
          break

          case "NullLiteral": continue
        }
      }

      console.log("push:", value)
      classnames.push(value)
    }
    // let baseUrlValue = getBaseUrl(baseUrl.node)
    // let queryParamValue = buildUrlQueryParam(queryParam.node)

    console.log("Updating code")

    path.replaceWith(
      template.statement.ast(`\`${classnames.join(' ').trim()}\``)
    )
  })
// ...

function handleObject(node: ObjectExpression): string {
  for (const prop of node.properties) {
    switch (prop.type) {
      case "ObjectMethod": continue // ignored
      case "ObjectProperty":
        if (prop.key.type === "Identifier" && prop.key.name === "class") {
          return getString(prop.value as Expression, true)
        }

        throw new Error(`macro_mergeClassnames() -> walk: case ${prop.key.type} hasn't been handled yet.`)
      case "SpreadElement":
        throw new Error("not impl")
    }
  }
}