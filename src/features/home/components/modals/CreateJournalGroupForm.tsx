import { 
  createForm, 
  required, 
  type SubmitHandler 
} from "@modular-forms/solid"
import IconInput from "./IconInput"
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalGroup, 
  type JournalGroupData 
} from "~/api"
import { fetchIt } from "~/utils"
import { 
  Button, 
  ButtonSizeVariant, 
  FieldInput, 
} from "~/components"
import { toast } from '~/libs/toast'
import { createSignal } from "solid-js"
import { addJournalList } from "../JournalList"

interface ICreateJournalGroupFormProps {
  onClick: () => any
}

export default function CreateJournalGroupForm(props: ICreateJournalGroupFormProps) {
  const [_journalGroupForm, { Field, Form }] = createForm<JournalGroup>()
  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const callApi = (data: JournalGroup) => {
    return fetchIt<JournalGroupData>('POST', JOURNAL_GROUP_ROUTE, data)
  }

  const submit: SubmitHandler<JournalGroup> = async(data) => {
    setSubmitButtonDisabled(true)
    const dataReturned = await toast
      .promise(callApi(data), {
        loading: 'Saving changes...',
        success: 'Done!',
        error: 'Failed to save changes :('
      })
      .catch(() => setSubmitButtonDisabled(false))
    // ...

    if (!dataReturned) return

    setSubmitButtonDisabled(false)
    addJournalList(dataReturned)
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
      <Button 
        $size={ButtonSizeVariant.sm} 
        type="submit" 
        disabled={submitButtonDisabled()}
      >
        Create it!
      </Button>
    </Form>
  )
}