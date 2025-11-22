import { createSignal, Show, type ParentComponent } from "solid-js"

export type BaseInputComponent = ParentComponent<{
  onKeyDown?: EventType<"input", 'onKeyDown'>
  value?: string
}>

export type BaseReadonlyComponent = ParentComponent<{
  onClick?: AnyFunction
}>

interface IInputShortcutHandlerOptions<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
> {
  /**Keeps it permanently read-only if set this to `true` */
  readonly$?(): boolean
  /**Triggered when the content is changed via pressing `Enter`. 
   * @note Pressing `Shift` + `Enter` won't trigger this event.
   * @param newContent the new input content
   */
  onFinalize$(newContent: string): any
  /**Triggered when the user discard the changes via pressing `ESC` button */
  onDiscard$(originalContent: string): any
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
 * @param options see {@link IInputShortcutHandlerOptions} for options.
 * @returns 
 */
export function createToggableInput<
  T extends BaseInputComponent,
  U extends BaseReadonlyComponent
>(options: IInputShortcutHandlerOptions<T, U>) {
  const [isShowingInput, setIsShowingInput] = createSignal(false)
  const [content, setContent] = createSignal(options.label$?.() ?? '')

  const handleKeyPress = (keyboardEvent: KeyboardEvent & {
    currentTarget: Ref<"textarea" | "input">
  }) => {
    const keyPressed = keyboardEvent.key.toLowerCase()
    const content = keyboardEvent.currentTarget.value
    switch (keyPressed) {
      case "escape":
        setIsShowingInput(false) 
        return options.onDiscard$(content)
      case "enter":
        if (keyboardEvent.shiftKey) return
        setContent(content)
        setIsShowingInput(false)
        return options.onFinalize$(content)
    }
  }

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
          onKeyDown={handleKeyPress}
          value={content()}
        />
      </Show>
    )
  }
}