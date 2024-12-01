// ...
import { 
  DialogContent,
  DialogTitle,
} from "../../../../components"
import type { IDialog } from "../../../../utils"
// ...
import stylex from "@stylexjs/stylex"
import EditJournalGroupForm from "./EditJournalGroupForm"
import type { JournalApi.GroupData } from "~/api"

const style = stylex.create({
  $content: {
    width: '50%'
  }
})

interface IEditJournalGroupModalProps extends IDialog, JournalApi.GroupData {
  // ...
}

export default function EditJournalGroupModal(props: IEditJournalGroupModalProps) {
  return (
    <DialogContent 
      $closeOnClickOutside={false}
      {...stylex.attrs(style.$content)}
    >
      <DialogTitle>
        Edit group
      </DialogTitle>
      <EditJournalGroupForm {...props} onClick={props.$close} />
    </DialogContent>
  )
}