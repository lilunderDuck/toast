import type { FieldValues, createForm, SubmitHandler } from "@modular-forms/solid"
import { createSignal, type JSX, type ParentProps } from "solid-js"
// ...
import { Button, ButtonRow } from "~/components"

// intentionally hacking the types, totally worth it
export type CreateForm<T extends {}> = ReturnType<typeof createForm<T>>
export type FormStore<T extends {}> = CreateForm<T>[0]
export type FormComponent<T extends {}> = CreateForm<T>[1]
export type FieldComponent<T extends {}> = FormComponent<T>["Field"]
// export type FieldComponent<T extends {}> = FormComponent<T>["Field"]

/**Options for creating a submit form component.
 *
 * @template T The type of the form data.
 */
export interface ISubmitFormOptions<T extends FieldValues> {
  /**The text displayed on the submit button */
  submitButtonText$: string
  buttonRow$?: JSX.Element
  /**This function gets called when the form is submitted.
   * It receives the form data and the submit event as arguments. 
   */
  onSubmit$: SubmitHandler<T>
}

/**Creates a form component with a submit button and handles form submission.
 * It disables the submit button while the form is being submitted.
 * @example
 * ```tsx
 * import { createForm } from "@modular-forms/solid"
 * // define your schema
 * type Schema = {
 *   something: string
 * }
 * 
 * // create your submit form
 * const [, { Field, Form }] = createForm<Schema>()
 * const { Form$ } = createSubmitForm<Schema>(Form, {
 *   submitButtonText$: "Submit data",
 *   async onSubmit$(data) {
 *     // ... do something with the submit data here ...
 *     // the submit button will be disabled, and when you done will the data or
 *     // throw an error here, the submit button will be enabled again.
 *   }
 * })
 * 
 * // now you can use it in your component
 * <Form$>
 *   Something inside here
 * </Form$>
 * ```
 *
 * @template T The type of the form data.
 * @param FormComponent The form component to wrap with submit functionality, you can see the example above.
 * @param options The options for creating the submit form component.
 * @returns An object containing the enhanced form component.
 * 
 * @see {@link ISubmitFormOptions} for form creation options.
 */
export function createSubmitForm<T extends FieldValues>(
  FormComponent: FormComponent<T>["Form"],
  options: ISubmitFormOptions<T>
) {
  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const submitThis: SubmitHandler<T> = async(data, submitEvent) => {
    console.log("Handle form submittion now.")
    setSubmitButtonDisabled(true)
    try {
      await options.onSubmit$(data, submitEvent)
    } catch(error) {
      console.error("Submittion error:", error)
    }

    setSubmitButtonDisabled(false)
  }

  return {
    /**Renders the form component with the submit button and handles the submit event.
     * @param props.
     * @returns `JSX.Element`
     */
    Form$: (props: ParentProps) => (
      // @ts-ignore
      <FormComponent onSubmit={submitThis}>
        {props.children}
        <ButtonRow>
          {options.buttonRow$}
          <Button 
            size$={ButtonSize.sm} 
            type="submit" 
            disabled={submitButtonDisabled()}
          >
            {options.submitButtonText$}
          </Button>
        </ButtonRow>
      </FormComponent>
    )
  }
}