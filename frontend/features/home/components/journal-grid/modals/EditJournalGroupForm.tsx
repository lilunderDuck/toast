import { createForm, required } from "@modular-forms/solid"
// ...
import { 
  type IJournalGroupData,
  type JournalGroupSchema,
  api_updateGroup
} from "~/api/journal"
import { FieldInput } from "~/components"
import { toast } from '~/features/toast'
import { useJournalHomeContext } from "~/features/home/provider"
import { createSubmitForm } from "~/hook"
// ...
import IconInput from "./IconInput"

interface IEditJournalGroupFormProps extends IJournalGroupData {
  onClick: () => any
}

export default function EditJournalGroupForm(props: IEditJournalGroupFormProps) {
  const [, { Field, Form }] = createForm<JournalGroupSchema>()
  const { grid$, infoSidebar$ } = useJournalHomeContext()

  let choosenFilePath: string | undefined
  const { Form$ } = createSubmitForm<JournalGroupSchema>(Form, {
    submitButtonText$: "Edit",
    async onSubmit$(data) {
      data.icon = choosenFilePath
      const dataReturned = await toast.promise(api_updateGroup(props.id, data), {
        loading: 'Saving changes...',
        success: 'Done!',
        error: 'Failed to save changes :('
      })

      grid$.update$(dataReturned)
      infoSidebar$.update$(dataReturned)
      props.onClick()
    }
  })

  return (
    <Form$>
      <IconInput choosenFilePath$={(file) => choosenFilePath = file} />
      <Field name="name" validate={[
        required('This field is required')
      ]}>
        {(field, inputProps) => (
          <FieldInput
            {...inputProps}
            label='Name'
            placeholder="What is your journal about?"
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
            label='Description'
            multiline={true}
            placeholder="What is your journal about?"
            type="text"
            required
            value={field.value ?? props.description}
            error={field.error}
          />
        )}
      </Field>
    </Form$>
  )
}