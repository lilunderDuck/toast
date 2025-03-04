import { createForm, required, SubmitHandler } from "@modular-forms/solid"
// ...
import { FieldInput, OpenAndCloseButton } from "~/components"
import { resetFieldInputs } from "~/utils"
// ...
import type { TodoSectionSchema } from "../../TodoBlock"
import { useTodoDataContext } from "../../data"
import { useTodoSectionContext } from "../TodoSectionProvider"

interface ICreateSectionInputProps {
  // ...
}

export default function CreateSectionInput(props: ICreateSectionInputProps) {
  const [sectionForm, { Form, Field }] = createForm<TodoSectionSchema>()
  const { createSection$ } = useTodoDataContext()
  const { closeSectionInput$ } = useTodoSectionContext()

  const onSubmit: SubmitHandler<TodoSectionSchema> = (data) => {
    createSection$(data)
    resetFieldInputs(sectionForm, { name: '' })
  }

  return (
    <Form onSubmit={onSubmit}>
      <Field name="name" validate={[required(' ')]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            label='Name'
            placeholder="The section name"
            type="text"
            autocomplete="off"
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
          onClick: closeSectionInput$
        }}
        closeText$='Cancel'
        openText$="Create"
      />
    </Form>
  )
}