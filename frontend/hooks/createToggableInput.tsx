import { createSignal, Show, type ParentComponent } from "solid-js"

// Note: if you ignore `never` type, then there's an very helpful log message on
// dev mode to hold your bear back.
// 
// You can't escape.
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

/**A helper utility to create a keyboard event handler to implement click-to-edit-text
 * UI pattens, specifically for text inputs and textareas.
 * @param options see {@link IInputShortcutHandlerOptions} for options
 * @returns A handler function.
 * @see {@link InputContent}
 */
export function createInputShortcutHandler<T extends HTMLTags>(
  options: IInputShortcutHandlerOptions<T>
) {
  const handleKeyPress = (keyboardEvent: KeyboardEvent & {
    currentTarget: Ref<T>
  }) => {
    const keyPressed = keyboardEvent.key.toLowerCase()
    if (TOAST_DEBUG) {
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
          " .  |     //        ^^^^^^^ same here",
          " 6  |     // ... your code ... ",
          " 7  |   }",
          " 8  | })",
        ].join('\n'))
      }
    }
    
    // @ts-ignore - will work just fine
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

export type BaseInputComponent = ParentComponent<Partial<{
  onKeyDown: EventHandler<"input", 'onKeyDown'>
  value: string
}>>

export type BaseReadonlyComponent = ParentComponent<{
  onClick?: AnyFunction
}>

interface IToggaleInputOptions<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
> {
  /**Keeps it permanently read-only if set this to `true`. */
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
  initialContent$?(): string
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
 *   const [readonly, setReadonly] = createSignal(false)  
 * 
 *   const { Input$ } = createToggableInput({
 *     // You can pass in an Accessor to this
 *     readonly$: readonly,
 *     // or passing a regular function returns a boolean
 *     readonly$: () => true,
 *     // ---------------------------------
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
 * @see {@link BaseInputComponent}
 * @see {@link BaseReadonlyComponent}
 */
export function createToggableInput<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
>(options: IToggaleInputOptions<T, U>) {
  const [isShowingInput, setIsShowingInput] = createSignal(false)
  const [content, setContent] = createSignal(options.initialContent$?.() ?? '')

  let inputRef!: Ref<"input">
  const discardContent: IInputShortcutHandlerOptions<"input">["onDiscard$"] = (content) => {
    setIsShowingInput(false)
    options.onDiscard$?.(content)
  }

  const handleKeyPress = createInputShortcutHandler({
    onDiscard$: discardContent,
    onFinalize$(content) {
      setContent(content)
      setIsShowingInput(false)
      options.onFinalize$?.(content)
    }
  })

  const shouldShowInput = () => !(options.readonly$?.() ?? false) && isShowingInput()

  const showInput = () => {
    setIsShowingInput(true)
    // Make sure that inputRef is not undefined, we wait for a little bit
    // to make sure that it exist in the DOM.
    queueMicrotask(() => inputRef?.focus())
  }

  return {
    /**An `Accessor` to get whether the input is currently on readonly mode or not */
    isShowingInput$: isShowingInput,
    Input$: () => (
      <Show when={shouldShowInput()} fallback={
        <options.component$.Readonly$ onClick={showInput}>
          {content()}
        </options.component$.Readonly$>
      }>
        <options.component$.Input$
          onKeyDown={handleKeyPress}
          value={content()}
          ref={inputRef}
        />
      </Show>
    )
  }
}