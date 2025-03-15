// ...
import { 
  DialogContent,
  DialogTitle,
  type IDialog
} from "~/components"
import type { IJournalGroupData } from "~/api/journal"
// ...
import stylex from "@stylexjs/stylex"
// ...
import EditJournalGroupForm from "./EditJournalGroupForm"

const style = stylex.create({
  content: {
    width: '50%'
  }
})

interface IEditJournalGroupModalProps extends IDialog, IJournalGroupData {
  // ...
}

export default function EditJournalGroupModal(props: IEditJournalGroupModalProps) {
  return (
    <DialogContent 
      closeOnClickOutside$={false}
      {...stylex.attrs(style.content)}
    >
      <DialogTitle>
        Edit group
      </DialogTitle>
      <EditJournalGroupForm {...props} onClick={props.close$} />
    </DialogContent>
  )
}