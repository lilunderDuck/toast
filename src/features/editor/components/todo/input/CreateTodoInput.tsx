import { createForm, required, SubmitHandler } from "@modular-forms/solid"
// ...
import { TodoSchema } from "~/features/editor/types"
import { FieldInput, OpenAndCloseButton } from "~/components"
// ...
import { resetFieldInputs } from "~/utils"
import { ThisEditorGlobal } from "~/features/editor/core"

interface ICreateTodoInputProps {
  onClose$(): void
  onSubmit$(data: TodoSchema): void
}

export default function CreateTodoInput(props: ICreateTodoInputProps) {
  const [thisForm, { Form, Field }] = createForm<TodoSchema>()

  const onSubmit: SubmitHandler<TodoSchema> = (data) => {
    props.onSubmit$(data)
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
            value={field.value}
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
            value={field.value}
            error={field.error}
          />
        )}
      </Field>

      <OpenAndCloseButton
        closeText$='Cancel'
        openText$="Create" 
        openButtonProps$={{
          type: 'submit',
        }}
        onClickingClose$={props.onClose$}
      />
    </Form>
  )
}