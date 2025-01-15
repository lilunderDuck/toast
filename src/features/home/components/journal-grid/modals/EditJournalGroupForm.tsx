import { createForm, required, SubmitHandler } from "@modular-forms/solid"
import { createSignal } from "solid-js"
// ...
import { 
  IJournalGroupData,
  JOURNAL_GROUP_ROUTE,
  JournalGroupSchema,
} from "~/api/journal"
import { Button, ButtonSizeVariant, FieldInput } from "~/components"
import { toast } from '~/features/toast'
import { fetchIt } from "~/utils"
// ...
import IconInput from "./IconInput"
import { useJournalHomeContext } from "~/features/home/provider"

interface IEditJournalGroupFormProps extends IJournalGroupData {
  onClick: () => any
}

export default function EditJournalGroupForm(props: IEditJournalGroupFormProps) {
  const [_journalGroupForm, { Field, Form }] = createForm<JournalGroupSchema>()
  const { $grid, $infoSidebar } = useJournalHomeContext()

  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const callApi = (id: string, data: JournalGroupSchema) => {
    const route = `${JOURNAL_GROUP_ROUTE}?id=${id}` as const
    return fetchIt<IJournalGroupData>('PATCH', route, data)
  }

  const submit: SubmitHandler<JournalGroupSchema> = async(data) => {
    setSubmitButtonDisabled(true)
    const dataReturned = await toast
      .promise(callApi(props.id, data), {
        loading: 'Saving changes...',
        success: 'Done!',
        error: 'Failed to save changes :('
      })
      .catch(() => setSubmitButtonDisabled(false))
    // ...

    if (!dataReturned) return

    setSubmitButtonDisabled(false)
    $grid.$update(dataReturned)
    $infoSidebar.$update(dataReturned)
    props.onClick()
  }

  return (
    <Form onSubmit={submit}>
      <IconInput />
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
      <Button 
        $size={ButtonSizeVariant.sm} 
        type="submit" 
        disabled={submitButtonDisabled()}
      >
        Yup
      </Button>
    </Form>
  )
}