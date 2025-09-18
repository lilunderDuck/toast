import { MACRO_EXPORTS } from "../../config"
import assert from "node:assert"
import { describe, it } from "node:test"
import { createTestTransformer, type Macro } from "vite-plugin-macro"

let namespacedMacros = null as unknown as Record<string, Macro[]>
function transform(code: string) {
  const transformerrrrr = createTestTransformer()
  if (!namespacedMacros) {
    namespacedMacros = {}
    for (const [macroName, macroOptions] of Object.entries(MACRO_EXPORTS)) {
      namespacedMacros[macroName] = macroOptions.macros
    }
  }

  return eval(transformerrrrr(code, namespacedMacros))
}

describe("macro_mergeClassnames", () => {
  it("should merge 2 classnames", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      macro_mergeClassnames("something", "anything")  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("can merge classname with an object", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      const someObject = { class: "anything" }
      macro_mergeClassnames("something", someObject)  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("can merge classname contains functions", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      const someFunction = () => {
        return { class: "anything" }
      }
      
      macro_mergeClassnames("something", someFunction())  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("can deal with conditional statement inside macro", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      const alwaysTrue = () => true      
      macro_mergeClassnames("something", alwaysTrue() ? "anything" : "i-guess")  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("can deal with conditional statement inside macro (object)", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      const alwaysTrue = () => true      
      const someObject = { class: "anything" }
      macro_mergeClassnames("something", alwaysTrue() ? someObject : "i-guess")  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("can deal with conditional statement inside macro (function)", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      const alwaysTrue = () => true      
      const someFunction = () => ({ class: "anything" })
      macro_mergeClassnames("something", alwaysTrue() ? someFunction() : "i-guess")  
    `)
    assert.equal(transformedCode, "something anything")
  })

  it("(macro) can be nested.", () => {
    const transformedCode = transform(`
      import { macro_mergeClassnames } from "macro-def"
      macro_mergeClassnames(
        "something", 
        macro_mergeClassnames("anything", "i-guess")
      )  
    `)
    assert.equal(transformedCode, "something anything i-guess")
  })
})