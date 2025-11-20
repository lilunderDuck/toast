import type { Expression } from "@babel/types"
import { defineMacro } from "vite-plugin-macro"
import { painfullyRebuildTemplateLiteral } from "./utils"

export const escapeCssUrl = defineMacro('ESCAPE_CSS_URL')
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

    throw new Error("ESCAPE_CSS_URL() args[0]: Must be a string")

  })
// 