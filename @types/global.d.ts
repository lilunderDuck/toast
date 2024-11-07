import type { JSX } from "solid-js"

export {}

declare global {
  /**Short-hand for
   * ```
   * import { JSX } from "solid-js"
   * type DivProps = JSX.HTMLElementTags<Something>
   * // use somewhere...
   * ```
   * 
   * It also cutting down the need to use
   * ```
   * JSX.HTMLAttributes<T>
   * JSX.AnchorHTMLAttributes<T>
   * JSX.AudioHTMLAttributes<T>
   * JSX.ButtonHTMLAttributes<T>
   * // ... many more ...
   * ```
   * 
   * @template ElementName the html element name, example: `'div'`
   */
  type HTMLAttributes<ElementName extends keyof HTMLElementTagNameMap> = 
    JSX.HTMLElementTags[ElementName]
  // ...

  type EventHandler<
    ElementName extends keyof HTMLElementTagNameMap, 
    EventName extends keyof HTMLAttributes<ElementName>
  > =
    HTMLAttributes<ElementName>[EventName]
  // ...

  type AnyFunction = (...anything: any[]) => any
}