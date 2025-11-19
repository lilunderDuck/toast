import { defineMacro } from "vite-plugin-macro"
import type { ConditionalExpression, Expression, ObjectExpression } from "@babel/types"
// ...
import { escapeIdentifier, generateCodeFromAst, getString } from "./utils"

export const mergeClassnames = defineMacro('MERGE_CLASS')
  .withSignature(
    '<T extends (string | { class?: string | undefined } | undefined)[]>(...name: T): string',
    "Merge many class name into a giant class names."
  )
  .withHandler(({ path, args }, { template }) => {
    const params = args as Expression[]
    let classnames: string[] = []

    for (const prop of params) {
      let value = ''
      // @ts-ignore
      const node = prop.node as Expression
      // log the heck out in case weird shit happens
      // console.log("hit case ->", prop.type)

      switch (prop.type) {
        // Handle conditional statement like this
        //    MERGE_CLASS(condition ? "this-classname" : "that-classname")
        case "ConditionalExpression":
          value = handleConditional(node as ConditionalExpression)
        break

        default:
          const evalValue = handleCommonCase(node)
          if (evalValue === SKIP) continue
          if (typeof evalValue === "string") value = evalValue
        break
      }

      classnames.push(value)
    }

    path.replaceWith(
      template.statement.ast(`\`${classnames.join(' ').trim()}\``)
    )
  })
// ...

const FALL_THROUGH = 1
const SKIP = null
function handleCommonCase(node: Expression, dontEscapeIdentifier = false): string | null | number {
  switch (node.type) {
    // ignore "null" if one of the argument contains null
    case "NullLiteral": return SKIP
    // There's a limit to this implementation.
    // Because the macro assumes everything you pass through is a object, you can't do this: 
    //    const classNames = "ye ye"
    //    MERGE_CLASS(classNames)
    // Replaced with:
    //    `${"ye ye".class}` -> "undefined"
    // "classNames" must be an object with a "class" prop in it to make this works.
    // 
    // Damn, I really wish it has some kind of static analysis stuff or type information 
    // to determine if my "props" is actually an object, or any other type.
    // 
    // Javascript is a very complex language.
    case "Identifier":
    case "StringLiteral":
    case "TemplateLiteral":
      return node.type === "Identifier" ?
        (dontEscapeIdentifier ? `${node.name}.class` : escapeIdentifier(`${node.name}.class`)) :
        // Otherwise handle other kind of strings.
        // Well, if you pass in the wrong node type, it makes sure to yell out loud, ofc.
        (dontEscapeIdentifier ? `"${getString(node, true)}"` : getString(node, true))

    // Handle case when you paste in a object contains a "class" prop, like this:
    //    MERGE_CLASS({ class: "some class names in here" })
    case "ObjectExpression":
      return handleObject(node as ObjectExpression)

    // Handle case when you have stylex call inside, like this:
    //    MERGE_CLASS(stylex.attrs(style.someStyle))
    // 
    // When called, it will be replaced with one of these:
    // -> `{ class: "x78zum5 x6s0dn4 x883omv" }.class`  (dev mode)
    // -> `x78zum5 x6s0dn4 x883omv`                     (prod mode)
    case "CallExpression":
      // regenerate the code and let stylex do its job
      return dontEscapeIdentifier ? `${generateCodeFromAst(node)}.class` : escapeIdentifier(`${generateCodeFromAst(node)}.class`)

    case "MemberExpression":
      const code = generateCodeFromAst(node)
      // if one of the argument is "undefined", just ignore it
      if (code === "undefined") return FALL_THROUGH
      return dontEscapeIdentifier ? code : escapeIdentifier(code)
    
    default:
      // console.log("case", node.type, "not handled")
      return SKIP
  }
}

function handleObject(node: ObjectExpression): string {
  for (const prop of node.properties) {
    switch (prop.type) {
      // if for some reason, the input object has some method mixed in like this
      //   { class: "<some classnames>", method() {} }
      // just ignore it
      case "ObjectMethod": continue
      // if we walk into a object prop.
      case "ObjectProperty":
        // make sure that this object has a "class" prop, then exit the loop.
        if (prop.key.type === "Identifier" && prop.key.name === "class") {
          return getString(prop.value as Expression, true)
        }

        // make sure to yell if I don't handle something
        throw new Error(`MERGE_CLASS() -> walk: case ${prop.key.type} hasn't been handled yet.`)
      case "SpreadElement":
        throw new Error("not impl")
    }
  }

  // if for some reason we can't find anything, throw an error
  throw new Error("Missing \"class\" prop")
}

function handleConditional(node: ConditionalExpression): string {
  let testCondidionString
  try {
    testCondidionString = generateCodeFromAst(node.test)
  } catch {
    // there's currently an error if you write like this
    //   MERGE_CLASS(some.conditionInAMethod() ? "this-class" : "that-class")
    // I'll fix that later
  }
  const trufyValue = handleCommonCase(node.consequent, true)!
  const falsyValue = handleCommonCase(node.alternate, true)!

  return `\${${testCondidionString}?${trufyValue}:${falsyValue}}`
}