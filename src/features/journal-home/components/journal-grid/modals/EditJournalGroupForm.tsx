import { createForm, required, SubmitHandler } from "@modular-forms/solid"
import { createSignal } from "solid-js"
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalApi
} from "~/api/journal"
import { Button, ButtonSizeVariant, FieldInput } from "~/components"
import { toast } from '~/features/toast'
import { fetchIt } from "~/utils"
// ...
import IconInput from "./IconInput"
import { useJournalHomeContext } from "~/features/journal-home/provider"

interface IEditJournalGroupFormProps extends JournalApi.IGroupData {
  onClick: () => any
}

export default function EditJournalGroupForm(props: IEditJournalGroupFormProps) {
  const [_journalGroupForm, { Field, Form }] = createForm<JournalApi.Group>()
  const { $grid, $infoSidebar } = useJournalHomeContext()

  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const callApi = (id: string, data: JournalApi.Group) => {
    const route = `${JOURNAL_GROUP_ROUTE}?id=${id}` as const
    return fetchIt<JournalApi.IGroupData>('PATCH', route, data)
  }

  const submit: SubmitHandler<JournalApi.Group> = async(data) => {
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