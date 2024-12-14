import { DialogContent, DialogTitle, IDialog } from "~/components"

interface ICreateJournalCategoryModalProps extends IDialog {
  // ...
}

export default function CreateJournalCategoryModal(props: ICreateJournalCategoryModalProps) {
  return (
    <DialogContent>
      <DialogTitle>
        Create new journal
      </DialogTitle>
    </DialogContent>
  )
}