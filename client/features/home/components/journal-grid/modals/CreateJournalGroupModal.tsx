// ...
import { 
  DialogContent,
  DialogDescription,
  DialogTitle,
  type IDialog
} from "client/components"
// ...
import CreateJournalGroupForm from "./CreateJournalGroupForm"
// ...
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  $content: {
    width: '50%'
  }
})

export default function CreateJournalGroupModal(props: IDialog) {
  return (
    <DialogContent 
      closeOnClickOutside$={false}
      {...stylex.attrs(style.$content)}
    >
      <DialogTitle>
        Create a new group
      </DialogTitle>
      <DialogDescription>
        Group many things into one place
      </DialogDescription>
      <CreateJournalGroupForm onClick={props.close$} />
    </DialogContent>
  )
}