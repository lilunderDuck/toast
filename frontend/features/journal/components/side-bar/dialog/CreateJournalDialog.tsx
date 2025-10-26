import { createSignal } from "solid-js"
import { required } from "@modular-forms/solid"
// ...
import { DialogContent, DialogHeader, FieldInput, RadioGroup, RadioGroupItem, RadioGroupItemLabel } from "~/components"
import { createSubmitForm, type ILazyDialog } from "~/hooks"
import { type IJournalContext } from "~/features/journal/provider"
import { journal } from "~/wailsjs/go/models"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./CreateJournalDialog.module.css"

const style = stylex.create({
  dialog: {
    width: "60%"
  }
})

type JournalOptionsSchema = {
  name: string
  type: number
} // copied from journal.JournalOptions

type JournalTypeStr = 'type_journal$' | 'type_folder$'

interface ICreateJournalDialogProps extends ILazyDialog {
  context$: IJournalContext
}

export default function CreateJournalDialog(props: ICreateJournalDialogProps) {
  const { createJournal$ } = props.context$

  const [journalType, setJournalType] = createSignal<JournalTypeStr>('type_journal$')
  const TYPE_MAPPING = {
    type_journal$: 0,
    type_folder$: 1,
  } as const

  const { Form$, Field$ } = createSubmitForm<JournalOptionsSchema>({
    async onSubmit$(data) {
      await createJournal$(TYPE_MAPPING[journalType()], data as unknown as journal.JournalOptions)
      props.close$()
    },
    submitButtonText$: "Create"
  })

  return (
    <DialogContent {...stylex.attrs(style.dialog)}>
      <DialogHeader>Create new journal</DialogHeader>
      <Form$>
        <Field$ name="name" validate={[required("Please insert a name")]}>
          {(field, inputProps) => (
            <FieldInput 
              {...inputProps}
              placeholder="Journal name"
              label="Name"
              error={field.error}
              value={field.value} 
            />
          )}
        </Field$>

        <RadioGroup defaultValue="type_journal$" onChange={setJournalType} class={__style.radioGroup}>
          <RadioGroupItem value="type_journal$">
            <div>
              <RadioGroupItemLabel>Journal</RadioGroupItemLabel>
              <p>Standard journal/(quick) note. This is the default option.</p>
            </div>
          </RadioGroupItem>
          <RadioGroupItem value="type_folder$">
            <div>
              <RadioGroupItemLabel>Folder</RadioGroupItemLabel>
              <p>Just like a category.</p>
            </div>
          </RadioGroupItem>
        </RadioGroup>
      </Form$>
    </DialogContent>
  )
}