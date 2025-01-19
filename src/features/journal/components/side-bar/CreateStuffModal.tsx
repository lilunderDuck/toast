import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { 
  DialogContent, 
  DialogTitle,
  type IDialog, 
  RadioGroup, 
  RadioGroupItem, 
  RadioGroupItemLabel 
} from "~/components"
import { JournalFileType } from "~/api/journal"
// ...
import { CreateStuffProvider, useCreateStuffContext } from "./CreateStuffProvider"
import CreateJournalCategoryForm from "./CreateStuffForm"

const style = stylex.create({
  radioGroup: {
    marginTop: 15
  },
  description: {
    fontSize: 13,
    color: 'var(--gray11)',
    lineHeight: 1.3
  }
})

interface ICreateJournalCategoryModalProps extends IDialog {
  // ...
}

export default function CreateJournalCategoryModal(props: ICreateJournalCategoryModalProps) {
  return (
    <DialogContent>
      <DialogTitle>
        Create new stuff
      </DialogTitle>

      <CreateStuffProvider>
        <Content {...props} />
      </CreateStuffProvider>
    </DialogContent>
  )
}

function Content(props: ICreateJournalCategoryModalProps) {
  const { $submitButtonDisabled, $selected } = useCreateStuffContext()
  
  const [, setSubmitButtonDisabled] = $submitButtonDisabled
  const [selected, setSelected] = $selected

  type Stuff = { $name: string, $description: string, $type: JournalFileType }[]
  const items: Stuff = [
    { $name: "journal", $type: JournalFileType.journal, $description: "Classic diary to write some stuff." },
    { $name: "category", $type: JournalFileType.category, $description: "You can think of it as a folder, well, for more customization." },
  ]

  const thingSelected = (value: JournalFileType) => () => {
    if (value === selected()) {
      return
    }

    setSubmitButtonDisabled(false)
    setSelected(value)
  }

  return (
    <>
      <h5>Choose the type of journal</h5>
      <RadioGroup {...stylex.attrs(style.radioGroup)}>
        <For each={items}>
          {(it) => (
            <RadioGroupItem value={it.$name} onClick={thingSelected(it.$type)}>
              <RadioGroupItemLabel>
                <div>{it.$name}</div>
                <div {...stylex.attrs(style.description)}>{it.$description}</div>
              </RadioGroupItemLabel>
            </RadioGroupItem>
          )}
        </For>
      </RadioGroup>

      <h5>Give it a name</h5>
      <CreateJournalCategoryForm onClick={props.$close} />
    </>
  )
}