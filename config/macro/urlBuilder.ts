import { defineMacro } from "vite-plugin-macro"
import type { Expression, Identifier, ObjectProperty } from "@babel/types"
import { escapeIdentifier, painfullyRebuildTemplateLiteral } from "./utils"
import type { NodePath } from "@babel/traverse"

export const urlBuilder = defineMacro('macro_urlBuilder')
  .withSignature('(baseUrl: string, queryParam?: Record<string, string | number>): string')
  .withHandler(({ path, args }, { template }) => {
    const [baseUrl, queryParam] = args as NodePath<Expression>[]
    let baseUrlValue = getBaseUrl(baseUrl.node)
    let queryParamValue = buildUrlQueryParam(queryParam.node)

    path.replaceWith(
      template.statement.ast(`\`${baseUrlValue}${queryParamValue}\``)
    )
  })
// ...

function buildUrlQueryParam(queryParam?: Expression) {
  if (!queryParam) return ''
  // this check does not do anything, but to avoid typescript getting angry.
  if (queryParam.type !== "ObjectExpression") return ''

  let queryList: string[] = []
  
  // ...
  for (const prop of queryParam.properties as ObjectProperty[]) {
    const propValue = prop.value
    let value = ''
    
    switch (propValue.type) {
      case "TemplateLiteral":
        value = painfullyRebuildTemplateLiteral(propValue)
      break

      case "Identifier":
        value = escapeIdentifier(propValue.name)
      break

      case "StringLiteral":
        value = propValue.value
      break

      default:
        throw new Error(`macro_urlBuilder() arg[1]: Case ${propValue.type} has not been handled yet.`)
    }

    queryList.push(`${(prop.key as Identifier).name}=${value}`)
  }

  return `?${queryList.join("&")}` as const
}

function getBaseUrl(baseUrl: Expression) {
  switch (baseUrl.type) {
    case "StringLiteral":
      return baseUrl.value
    case "TemplateLiteral":
      return painfullyRebuildTemplateLiteral(baseUrl)
    case "Identifier":
      return escapeIdentifier(baseUrl.name)
    default:
      throw new Error(`macro_urlBuilder() arg[0]: Case ${baseUrl.type} has not been handled yet.`)
  }
}