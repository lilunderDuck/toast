import { createForm, required, type SubmitHandler } from "@modular-forms/solid"
// ...
import { FieldInput, OpenAndCloseButton } from "~/components"
import { resetFieldInputs } from "~/utils"
// ...
import { 
  type TodoSectionData, 
  useTodoDataContext, 
  type TodoSectionSchema 
} from "../../data"
import { 
  useTodoSectionContext 
} from "../TodoSectionProvider"

interface ICreateSectionInputProps {
  previousData$?: Partial<TodoSectionData>
  onCancel$?: () => void
  onComplete$?: () => void
}

export default function CreateSectionInput(props: ICreateSectionInputProps) {
  const [sectionForm, { Form, Field }] = createForm<TodoSectionSchema>()
  const { createSection$, updateSection$ } = useTodoDataContext()
  const { closeSectionInput$ } = useTodoSectionContext()

  const onSubmit: SubmitHandler<TodoSectionSchema> = (data) => {
    if (props.previousData$) {
      updateSection$(props.previousData$.id!, data)
    } else {
      createSection$(data)
    }
    resetFieldInputs(sectionForm, { name: '' })
    props.onComplete$?.()
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
            value={field.value || props.previousData$?.name}
            error={field.error}
          />
        )}
      </Field>
      <OpenAndCloseButton 
        openButtonProps$={{
          type: 'submit'
        }}
        closeButtonProps$={{
          onClick: () => {
            closeSectionInput$()
            props.onCancel$?.()
          }
        }}
        closeText$='Cancel'
        openText$="Create"
      />
    </Form>
  )
}