import { createSignal, Show, type ParentComponent } from "solid-js"

type InputContent<T extends HTMLTags> = T extends "input" | "textarea" ? string : never

interface IInputShortcutHandlerOptions<T extends HTMLTags> {
  /**Triggered when the content is changed via pressing `Enter`. 
   * @note Pressing `Shift` + `Enter` won't trigger this event.
   * @param newContent the new input content
   */
  onFinalize$?(newContent: InputContent<T>): any
  /**Triggered when the user discard the changes via pressing `ESC` button */
  onDiscard$?(originalContent: InputContent<T>): any
}

export function createInputShortcutHandler<T extends HTMLTags>(
  options: IInputShortcutHandlerOptions<T>
) {
  const handleKeyPress = (keyboardEvent: KeyboardEvent & {
    currentTarget: Ref<T>
  }) => {
    const keyPressed = keyboardEvent.key.toLowerCase()
    isDevMode && (() => {
      const isInputOrTextarea =
        keyboardEvent.currentTarget instanceof HTMLTextAreaElement ||
        keyboardEvent.currentTarget instanceof HTMLInputElement
      // ...

      if (!isInputOrTextarea) {
        console.warn([
          "createInputShortcutHandler(): currentTarget is not a <textrea /> or <input /> element.",
          "You might be attach this event listener into a wrong element.\n",
          "But, if you're only using this hook for shortcut handler stuff, that fine, but keep in mind that if you tries to access content of the input, it will be undefined.\n",
          " 1  | const shortcutHandler = createInputShortcutHandler({",
          " 2  |   onDiscard$(content) {",
          " .  |     //       ^^^^^^^ will always be undefined",
          " 3  |     // ... your code ... ",
          " 4  |   }",
          " 5  |   onFinalize$(content) {",
          " .  |     //       ^^^^^^^ same here",
          " 6  |     // ... your code ... ",
          " 7  |   }",
          " 8  | })",
        ].join('\n'))
      }
    })()
    // @ts-ignore
    const content = keyboardEvent.currentTarget?.value
    switch (keyPressed) {
      case "escape":
        return options.onDiscard$?.(content)
      case "enter":
        if (keyboardEvent.shiftKey) return
        return options.onFinalize$?.(content)
    }
  }

  return handleKeyPress
}

export type BaseInputComponent = ParentComponent<{
  onKeyDown?: EventType<"input", 'onKeyDown'>
  value?: string
}>

export type BaseReadonlyComponent = ParentComponent<{
  onClick?: AnyFunction
}>

interface IToggaleInputOptions<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
> {
  /**Keeps it permanently read-only if set this to `true` */
  readonly$?(): boolean
  /**Triggered when the content is changed via pressing `Enter`. 
   * @note Pressing `Shift` + `Enter` won't trigger this event.
   * @param newContent the new input content
   */
  onFinalize$?(newContent: string): any
  /**Triggered when the user discard the changes via pressing `ESC` button */
  onDiscard$?(originalContent: string): any
  /**The initial content.
   * @default '' // empty string
   */
  label$?(): string
  component$: {
    Input$: T,
    Readonly$: U
  }
}

/**This utility hook manages the state for a common UI pattern where an element 
 * switches between a read-only view and an active input field upon interaction.
 * @example
 * ```tsx
 * import { createToggableInput, type BaseInputComponent, type BaseReadonlyComponent } from "~/hooks"
 * const Input: BaseInputComponent = (props) => (
 *   <input type="text" {...props} />
 * );
 * 
 * const Label: BaseReadonlyComponent = (props) => (
 *   <span {...props} />
 * )
 * 
 * const EditableTitle = () => {
 *   const { Input$ } = createToggableInput({
 *     label$: () => "Hello",
 *     onFinalize$: (newContent) => {
 *       // Do something with the newContent parameter,
 *       // maybe you can call your backend or something
 *     }, 
 *     onDiscard$: (finalContent) => {
 *       console.log('discarded');
 *     },
 *     component$: {
 *       Input$: Input,
 *       Readonly$: Label,
 *     },
 *   })
 *   
 *   return (
 *     <Input$ />
 *   )
 * }
 * ```
 * @param options see {@link IToggaleInputOptions} for options.
 * @returns 
 */
export function createToggableInput<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
>(options: IToggaleInputOptions<T, U>) {
  const [isShowingInput, setIsShowingInput] = createSignal(false)
  const [content, setContent] = createSignal(options.label$?.() ?? '')

  const handleKeyPress = createInputShortcutHandler({
    onDiscard$(content) {
      setIsShowingInput(false)
      options.onDiscard$?.(content)
    },
    onFinalize$(content) {
      setContent(content)
      setIsShowingInput(false)
      options.onFinalize$?.(content)
    }
  })

  const shouldShowInput = () => !(options.readonly$?.() ?? false) && isShowingInput()

  return {
    /**An `Accessor` to get whether the input is currently on readonly mode or not */
    isShowingInput$: isShowingInput,
    Input$: () => (
      <Show when={shouldShowInput()} fallback={
        <options.component$.Readonly$ onClick={() => setIsShowingInput(true)}>
          {content()}
        </options.component$.Readonly$>
      }>
        <options.component$.Input$
          // @ts-ignore - too lazy to fix type error 😴
          onKeyDown={handleKeyPress}
          value={content()}
        />
      </Show>
    )
  }
}