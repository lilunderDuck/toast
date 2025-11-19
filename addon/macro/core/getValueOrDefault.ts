import type { Expression, OptionalMemberExpression, StringLiteral } from "@babel/types"
import { defineMacro } from "vite-plugin-macro"
import { generateCodeFromAst } from "./utils"

export const getValueOrDefault = defineMacro('GET_VALUE_OR_DEFAULT')
  .withSignature(
    "<T extends any, U extends any>(input: T, checkValue: any, defaultValue: U)",
    "Check if `input` is equals to `checkValue`, returns `defaultValue` if it's true, otherwise returns whatever `input` value is."
  )
  .withHandler(({ path, args }, { template }) => {
    let [input, checkValue, defaultValue] = (args as Expression[]).map(it => {
      const thisNode = it.node
      // both astring and escodegen cannot handle this case:
      //    someObject?.optionalProp
      // it will throw an weird error.
      if (it.type === "OptionalMemberExpression") { 
        const thisObject = (thisNode as OptionalMemberExpression).object
        let name = ''
        if (thisObject.type === "CallExpression") {
          name = `${thisObject.callee.name}()`
        }
        return `${name}?.${thisNode.property.name}`
      }

      // why does astring can't handle this?
      // oh well, who knows?
      if (it.type === "StringLiteral") {
        return `"${(thisNode as StringLiteral).value}"`
      }

      return generateCodeFromAst(thisNode)
    })

    console.log("evaled code:", `${input}===${checkValue}?${defaultValue}:${input}`)

    path.replaceWith(
      template.statement.ast(`${input}===${checkValue}?${defaultValue}:${input}`)
    )
  })
// 