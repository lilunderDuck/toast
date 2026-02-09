import { Button, ButtonRow, DialogContent, DialogDescription, DialogHeader } from "~/components"
import type { IBaseLazyDialog } from "~/hooks"

interface ITableDeleteComfirmationDialogProps extends IBaseLazyDialog {
  onConfirmDeletion$(): void
}

export default function TableDeleteComfirmationDialog(props: ITableDeleteComfirmationDialogProps) {
  return (
    <DialogContent showCloseButton$={false}>
      <DialogHeader>
        Delete confirmation
      </DialogHeader>
      <DialogDescription>
        Are you sure you want to delete everything? Once you delete, it will be lost forever.
      </DialogDescription>
      <ButtonRow>
        <Button 
          size$={ButtonSize.SMALL} 
          variant$={ButtonVariant.DANGER}
          onClick={() => {
            props.onConfirmDeletion$()
            props.close$()
          }}
        >
          I'm absolutely sure
        </Button>
        <Button 
          size$={ButtonSize.SMALL} 
          onClick={props.close$}
        >
          No
        </Button>
      </ButtonRow>
    </DialogContent>
  )
}