import type { Expression } from "@babel/types"
import { defineMacro } from "vite-plugin-macro"

/**Generates a random number between 0 and the specified `bound`.
 *
 * @param bound
 * @returns A random number
 */
export function getRandomNumber(bound: number) {
  return Math.floor(Math.random() * bound)
}

/**Generate a sub-optimial random string within a specified `length`.
 * @see https://stackoverflow.com/a/1349426
 * @see https://stackoverflow.com/questions/1349404/generate-a-string-of-random-characters
*/
function makeId(length: number) {
  const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (var i = 0; i < length; i++) {
    result += CHARACTERS.charAt(getRandomNumber(CHARACTERS.length));
  }
  return result
}

export const randomString = defineMacro('RANDOM_STRING')
  .withSignature(
    "(length: number): string",
    "Generate a random string"
  )
  .withHandler(({ path, args }, { template }) => {
    let [input] = args as Expression[]
    if (input.type != "NumericLiteral") {
      throw new SyntaxError("ESCAPE_CSS_URL() args[0]: Must be a number")
    }

    const length = input.value
    path.replaceWith(
      template.statement.ast(`"${makeId(length)}"`)
    )
  })
// 