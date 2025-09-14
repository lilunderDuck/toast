import type { Expression, OptionalMemberExpression, StringLiteral } from "@babel/types"
import { defineMacro } from "vite-plugin-macro"
import { generateCodeFromAst, painfullyRebuildTemplateLiteral } from "./utils"

export const escapeCssUrl = defineMacro('macro_escapeCssUrl')
  .withSignature(
    "<const T extends any>(input: T)",
    "Escape an url, then wrap it inside `url('<something>')`"
  )
  .withHandler(({ path, args }, { template }) => {
    let [input] = args as Expression[]

    if (input.type === "TemplateLiteral") {
      path.replaceWith(
        template.statement.ast("url('${encodeURIComponent("+painfullyRebuildTemplateLiteral(input)+")}')")
      )
      return
    }

    throw new Error("macro_escapeCssUrl() args[0]: Must be a string")

  })
// 