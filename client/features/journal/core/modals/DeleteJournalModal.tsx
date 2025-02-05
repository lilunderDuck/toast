import { 
  Checkbox, 
  DialogContent, 
  DialogDescription, 
  DialogTitle, 
  FlexCenterY, 
  OpenAndCloseButton, 
  type IDialog 
} from "client/components"
import stylex from '@stylexjs/stylex'
// ...
import { useJournalContext } from "client/features/journal"
import type { IJournalData } from "client/api/journal"

const style = stylex.create({
  form: {
    width: '45%'
  },
  theTextBelow: {
    marginTop: 15,
    gap: 10
  }
})

interface IDeleteJournalModalProps extends IDialog {
  $journal: IJournalData
}

export default function DeleteJournalModal(props: IDeleteJournalModalProps) {
  const { $localStorage, $journal } = useJournalContext()

  return (
    <DialogContent {...stylex.attrs(style.form)}>
      <DialogTitle>
        Confirmation
      </DialogTitle>
      <DialogDescription>
        You're about to delete <b>{props.$journal?.name}</b>. Are you sure?

        <FlexCenterY {...stylex.attrs(style.theTextBelow)}>
          <Checkbox 
            onChange={(isChecked) => $localStorage.$set('shouldShowDeleteConfirmationModal', isChecked)} 
          />
          Make sure to delete right away, instead of asking me this.
        </FlexCenterY>
      </DialogDescription>
      <OpenAndCloseButton 
        openText$='Yup'
        closeText$='No, I changed my mind'
        onClickingClose$={props.close$}
        onClickingOpen$={async() => {
          await $journal.delete$(props.$journal?.id)
          props.close$()
        }}
      />
    </DialogContent>
  )
}