import { 
  createForm, 
  required, 
  type SubmitHandler 
} from "@modular-forms/solid"
import { createSignal } from "solid-js"
// ...
import { 
  type Journal,
  type JournalData, 
  JOURNAL_ROUTE, 
} from "~/api"
import { fetchIt } from "~/utils"
import { 
  FieldInput,
  OpenAndCloseButton
} from "~/components"
import { toast } from "~/libs/toast"
// ...
import { useJournalContext } from "../../../context"

interface ICreateJournalFormProps {
  onClick: () => any
}

export default function CreateJournalForm(props: ICreateJournalFormProps) {
  const { $currentGroup, $tree } = useJournalContext()
  const [, setTree] = $tree

  const [_journalGroupForm, { Field, Form }] = createForm<Journal>()
  const [submitButtonDisabled, setSubmitButtonDisabled] = createSignal(false)

  const callApi = (data: Journal) => {
    return fetchIt<JournalData>('POST', `${JOURNAL_ROUTE}?id=${$currentGroup()?.id}`, data)
  }

  const submit: SubmitHandler<Journal> = async(data) => {
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
    
    setTree(prev => [...prev, dataReturned])
    setSubmitButtonDisabled(false)
    props.onClick()
  }

  return (
    <Form onSubmit={submit} autocomplete="off">
      <Field name="name" validate={[
        required('Come on, put something into here you know?')
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
      <OpenAndCloseButton 
        $closeText='Dismiss'
        $openText="Submit"
        $onClickingClose={props.onClick}
        $openButtonProps={{
          type: 'submit',
          disabled: submitButtonDisabled()
        }}
      />
    </Form>
  )
}