import { createForm, required, SubmitHandler } from "@modular-forms/solid"
// ...
import type { TodoSectionSchema } from "~/features/editor/types"
import { ThisEditorGlobal } from "~/features/editor/core"
import { FieldInput, OpenAndCloseButton } from "~/components"
import { resetFieldInputs } from "~/utils"
// ...
import { TodoInputOptions } from "../provider"

interface ICreateTodoSectionInputProps extends TodoInputOptions<TodoSectionSchema> {}

export default function CreateTodoSectionInput(props: ICreateTodoSectionInputProps) {
  const [thisForm, { Form, Field }] = createForm<TodoSectionSchema>()

  const onSubmit: SubmitHandler<TodoSectionSchema> = (data) => {
    props.onSubmit$(data)
    resetFieldInputs(thisForm, {})
    ThisEditorGlobal.update$()
  }

  return (
    <Form onSubmit={onSubmit}>
      <Field name="name" validate={[required(' ')]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            placeholder="Give this section a name"
            autocomplete="off"
            type="text"
            required
            value={field.value ?? props.name}
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