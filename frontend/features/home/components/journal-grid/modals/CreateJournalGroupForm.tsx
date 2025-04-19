import { createForm, required } from "@modular-forms/solid"
// ...
import {
  type JournalGroupSchema,
  api_createGroup
} from "~/api/journal"
import { FieldInput } from "~/components"
import { toast } from '~/features/toast'
import { useJournalHomeContext } from "~/features/home/provider"
import { createSubmitForm } from "~/hook"
// ...
import IconInput from "./IconInput"

interface ICreateJournalGroupFormProps {
  onClick: () => any
}

export default function CreateJournalGroupForm(props: ICreateJournalGroupFormProps) {
  const [, { Field, Form }] = createForm<JournalGroupSchema>()
  const { grid$ } = useJournalHomeContext()

  let choosenFilePath: string | undefined
  const { Form$ } = createSubmitForm<JournalGroupSchema>(Form, {
    submitButtonText$: "Create",
    async onSubmit$(data) {
      data.icon = choosenFilePath
      const dataReturned = await toast.promise(api_createGroup(data), {
        loading: 'Saving changes...',
        success: 'Done!',
        error: 'Failed to save changes :('
      })

      grid$.add$(dataReturned)
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
            value={field.value}
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
            value={field.value}
            error={field.error}
          />
        )}
      </Field>
    </Form$>
  )
}