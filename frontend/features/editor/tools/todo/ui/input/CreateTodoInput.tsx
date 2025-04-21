import { createForm, required, SubmitHandler } from "@modular-forms/solid"
// ...
import { resetFieldInputs } from "~/utils"
import { FieldInput, OpenAndCloseButton } from "~/components"
// ...
import { useTodoSectionContext } from "../TodoSectionProvider"
import { TodoSchema, useTodoDataContext } from "../../data"

interface ICreateTodoInputProps extends Partial<TodoSchema> {
  // ...
}

export default function CreateTodoInput(props: ICreateTodoInputProps) {
  const [sectionForm, { Form, Field }] = createForm<TodoSchema>()
  const { sectionId$, closeTodoInput$ } = useTodoSectionContext()
  const { createTodo$ } = useTodoDataContext()

  const onSubmit: SubmitHandler<TodoSchema> = (data) => {
    createTodo$(sectionId$, data)
    resetFieldInputs(sectionForm, { name: '' })
  }
  
  return (
    <Form onSubmit={onSubmit}>
      <Field name="name" validate={[required(' ')]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            label='Name'
            placeholder="The todo name"
            type="text"
            autocomplete="off"
            required
            value={field.value || props.name}
            error={field.error}
          />
        )}
      </Field>
      <Field name="description">
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            label='Description'
            placeholder="The todo name"
            type="text"
            required
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
      <OpenAndCloseButton 
        openButtonProps$={{
          type: 'submit'
        }}
        closeButtonProps$={{
          onClick: closeTodoInput$
        }}
        closeText$='Cancel'
        openText$="Create"
      />
    </Form>
  )
}