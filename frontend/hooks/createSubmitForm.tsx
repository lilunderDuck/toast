import { type FieldValues, createForm, type SubmitHandler, type FieldsStore, type FieldPath } from "@modular-forms/solid"
import { DEBUG_ERR_LABEL, DEBUG_INFO_LABEL } from "macro-def"
import { createSignal, type JSX } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Button } from "~/components"
import type { FieldInput } from "~/components"
import type { Ref } from "~/utils"

// intentionally hacking the types, totally worth it
export type CreateForm<T extends {}> = ReturnType<typeof createForm<T>>
export type FormStore<T extends {}> = CreateForm<T>[0]
export type FormComponentObject<T extends {}> = CreateForm<T>[1]

export type FieldComponent<T extends {}> = FormComponentObject<T>["Field"]
export type FormComponent<T extends {}> = FormComponentObject<T>["Form"]
// export type FieldComponent<T extends {}> = FormComponentObject<T>["Field"]

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

type InputsCollection = HTMLCollectionOf<Ref<"input" | "textarea">>

/**Creates a form component with a submit button and handles form submission.
 * It disables the submit button while the form is being submitted.
 * @example
 * ```tsx
 * // define your schema
 * type Schema = {
 *   something: string
 * }
 * 
 * // create your submit form
 * const { Form$, Field$ } = createSubmitForm<Schema>({
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
 *   <Field$ name="something">
 *     {(field, inputProps) => <FieldInput
 *        {...inputProps}
 *        placeholder="Enter something into this"
 *        label="Something"
 *        error={field.error}
 *        value={field.value}
 *     />}
 *   </Field$>
 *   ...
 * </Form$>
 * ```
 *
 * @template T The type of the form data.
 * @param FormComponent The form component to wrap with submit functionality, you can see the example above.
 * @param options The options for creating the submit form component.
 * @returns An object containing the enhanced form component.
 * 
 * @see {@link ISubmitFormOptions} for form creation options.
 * @see {@link FieldInput} {@link FieldInput}
 */
export function createSubmitForm<T extends FieldValues>(options: ISubmitFormOptions<T>) {
  const [formStore, { Form, Field }] = createForm<T>()
  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const submitThis: SubmitHandler<T> = async (data, submitEvent) => {
    DEBUG_INFO_LABEL("form handler", "Handle form submittion now.")
    setSubmitButtonDisabled(true)
    if (TOAST_DEBUG) {
      try {
        await options.onSubmit$(data, submitEvent)
      } catch (error) {
        DEBUG_ERR_LABEL("form handler", "Submittion error:", error)
      }
    } else {
      await options.onSubmit$(data, submitEvent)
    }

    setSubmitButtonDisabled(false)
  }

  const fieldStore: FieldsStore<T> = formStore.internal.fields
  
  let formRef!: Ref<"form">
  const setFieldData = (data: T) => {
    for (const [key, value] of Object.entries(data)) {
      fieldStore[key as FieldPath<T>]?.value.set(value as any)
    }
  }

  return {
    clearFields$() {
      for (const key of Object.keys(fieldStore)) {
        // FIXME: very hacky way to reset the input
        fieldStore[key as FieldPath<T>]?.value.set('' as any)
      }
      
      for (const inputRef of formRef.getElementsByClassName('fieldInput__input') as InputsCollection) {
        inputRef.value = ''
      }
    },
    setFieldData$: setFieldData,
    Field$: Field,
    /**Renders the form component with the submit button and handles the submit event.
     * @param props.
     * @returns `JSX.Element`
     */
    Form$: (props: Parameters<FormComponent<T>>[0]) => (
      <Form {...props} onSubmit={submitThis} ref={formRef}>
        {props.children}
        <div class={css`display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px;`}>
          {options.buttonRow$}
          <Button
            type="submit"
            disabled={submitButtonDisabled()}
          >
            {options.submitButtonText$}
          </Button>
        </div>
      </Form>
    )
  }
}