import { createForm, required, type SubmitHandler } from "@modular-forms/solid"
// ...
import type { TodoSchema } from "~/features/editor/types"
import { ThisEditorGlobal } from "~/features/editor/core"
import { FieldInput, OpenAndCloseButton } from "~/components"
import { resetFieldInputs } from "~/utils"
// ...
import type { TodoInputOptions } from "../provider"

interface ICreateTodoInputProps extends TodoInputOptions<TodoSchema> {}

export default function CreateTodoInput(props: ICreateTodoInputProps) {
  const [thisForm, { Form, Field }] = createForm<TodoSchema>()

  const onSubmit: SubmitHandler<TodoSchema> = (data) => {
    try {
      props.onSubmit$(data)
    } catch (error) {
      console.log(error)
    }
    
    resetFieldInputs(thisForm, {
      name: '',
      description: undefined
    })
    ThisEditorGlobal.update$()
  }
  
  return (
    <Form onSubmit={onSubmit}>
      <Field name="name" validate={[required(' ')]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            placeholder="Give this todo a name"
            autocomplete="off"
            type="text"
            required
            value={field.value ?? props.name}
            error={field.error}
          />
        )}
      </Field>

      <Field name="description">
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            placeholder="Description here"
            autocomplete="off"
            type="text"
            required
            value={field.value ?? props.description}
            error={field.error}
          />
        )}
      </Field>

      <OpenAndCloseButton
        closeText$='Cancel'
        openText$={props.isEditMode$ ? 'Edit' : "Create"}
        openButtonProps$={{
          type: 'submit',
        }}
        onClickingClose$={props.onClose$}
      />
    </Form>
  )
}