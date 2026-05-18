import { defineMacro } from "vite-plugin-macro"

const ERR_MIS_USED = `CLS(): misused of CLS() macro
Make sure that you don't accidentally pass in this macro the wrong type.

The following cases are not allowed.
1  | CLS("some string")
2  | CLS(someVariable)
3  | CLS({ someObject: "..." })
.. | ...

Note: This macro is only used for this case
1  | import stylex from "@stylexjs/stylex"
2  | 
3  | const style = stylex.create({
4  |   someStyle: { ... }
5  | })
6  | 
7  | CLS(style.someStyle)
8  | // shorthands for stylex.attrs(style.someStyle).class
`

export const className = defineMacro('CLS')
  .withSignature(
    "(stylexStyle: object): string",
    "Generate a random string"
  )
  .withHandler(({ path, args }, { template }) => {
    let [input] = args
    if (input.type != "MemberExpression") {
      throw new SyntaxError(ERR_MIS_USED)
    }

    const thisNode = input.node
    let content = ""
    switch (thisNode.type) {
      case "MemberExpression":
        if (thisNode.object.type !== "Identifier" && thisNode.property.type !== "Identifier") {
          throw new SyntaxError(ERR_MIS_USED)
        }

        const objectName = thisNode.object.loc!.identifierName
        const objectProp = thisNode.property.loc!.identifierName
        content = `stylex.attrs(${objectName}.${objectProp}).class`
      break;
    
      default:
        throw new SyntaxError(`CLS(): invalid type ${thisNode.type}`)
    }

    // const length = input.value
    path.replaceWith(
      template.statement.ast(content)
    )
  })
// 

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
    }
    return value;
  };
};