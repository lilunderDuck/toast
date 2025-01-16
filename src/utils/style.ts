import type stylex from "@stylexjs/stylex"

/**Just the return type of `stylex.attrs` */
export type StylexStylesAttribute = ReturnType<typeof stylex.attrs>

type HasClassInIt = { class?: string }

/**Merges multiple class names into a single giant class.
 * @param something An array of class name elements to be merged.
 * @returns The merged class names as a single string.
 */
export function mergeClassname<T extends (HasClassInIt | string | undefined)[]>(
  ...something: T
) {
  let newClassname = ''
  for (const name of something) {
    if (!name) continue

    if (typeof name === "object") {
      newClassname += name.class ?? ''
    }
    else {
      newClassname += name
    }

    newClassname += ' '
  }

  return newClassname.trim()
}

/**Gets a property from `someObject` by `input` key, if `input` is `undefined` then
 * use `defaultKey` instead
 * @param someObject   The object to retrieve the property from.
 * @param input        The key of the property to retrieve. If `undefined`, the default key is used.
 * @param defaultKey   The default key to use if `input` is `undefined`.
 * @returns The value of the property corresponding to the specified key.
 */
export function defaultValueOrElse<T extends {}>(someObject: T, input: keyof T | undefined, defaultKey: keyof T) {
  return someObject[input ?? defaultKey]
}

/**Mounts a `<style>` element to the document head with the specified content.
 * @param id        the unique identifier for the style element.
 * @param content   the css styles
 * @returns A tuple containing:
 * - the ID of the style element
 * - A dispose function to remove it from the document
 */
function mountStyle(id: string, content: string) {
  const style = document.createElement('style')
  style.textContent = content
  document.head.append(style)
  return [id, () => style.remove()] as const
}

/**Generates a unique identifier for a CSS style element.
 * @returns The generated unique identifier.
 */
function createId() {
  return `d${crypto.randomUUID().slice(0, 7)}`
}

/**Inlines CSS variables as part of a style element.
 * @param cssVar An object containing the CSS variables and their values.
 * @returns A tuple containing:
 * - the ID of the style element, which you can use it to apply to other element
 * - A dispose function to remove it from the document
 */
export function inlineCssVar(cssVar: Record<string, string>) {
  const id = createId()
  let content = `#${id}${JSON.stringify(cssVar).replaceAll('"', '')}`
  // ...
  return mountStyle(id, content)
}

/**This is just a short-hand for
 * ```
 * document.body.classList
 * ```
 * @returns 
 */
export function bodyClasslist() {
  return document.body.classList
}

export const NO_STYLE = {}