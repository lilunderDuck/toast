import { css } from "molcss"
import { Button, DialogContent, Tab, TabContent, TabHeader } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"

interface ICreateGalleryDialogProps extends IBaseLazyComponent {
}

export default function CreateGalleryDialog(props: ICreateGalleryDialogProps) {
  return (
    <DialogContent class={css`width: 50%;`} showCloseButton$={false}>
      <h2>
        Create gallery
      </h2>

      <Tab pages$={[
        { name$: "Create new", Page$: () => <></> },
        { name$: "Import existing", Page$: () => <></> },
      ]}>
        <TabHeader tabButtonClass$={css`width: 100%;`} />
        <TabContent />
      </Tab>

      <div class={css`display: flex; align-items: flex-end;`}>
        <Button variant$={ButtonVariant.DANGER} onClick={props.close$}>
          Close
        </Button>
      </div>
    </DialogContent>
  )
}