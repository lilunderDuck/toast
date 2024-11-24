import { DialogContent, DialogTitle, type IDialog } from "~/components"
import CreateJournalForm from "./CreateJournalForm"
import stylex from '@stylexjs/stylex'

const style = stylex.create({
  form: {
    width: '45%'
  }
})

export default function CreateJournalModal(props: IDialog) {
  return (
    <DialogContent {...stylex.attrs(style.form)}>
      <DialogTitle>
        Create new journal
      </DialogTitle>

      <CreateJournalForm onClick={props.$close} />
    </DialogContent>
  )
}