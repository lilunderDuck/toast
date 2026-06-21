import { BsX } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { ZoomAndPanProvider, ZoomButtonRow, ZoomDisplay } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
// ...
import { Button, DialogContent, Tooltip } from "../ui"


const dialog = css`
  width: 100%;
  height: 100%;
  padding: 0 !important;
  background-color: transparent !important;
`

const dialog__image = css`
  height: auto;
`

const dialog__zoomButtonRow = css`
  position: absolute;
  z-index: 20;
`

interface IImageFullviewDialogContentProps extends IBaseLazyComponent {
  imageSrc$: string
}

export default function ImageFullviewDialogContent(props: IImageFullviewDialogContentProps) {
  return (
    <DialogContent class={dialog} showCloseButton$={false}>
      <ZoomAndPanProvider>
        <div class={dialog__zoomButtonRow}>
          <ZoomButtonRow>
            <Tooltip label$="Close">
              <Button 
                size$={ButtonSize.ICON}
                onClick={props.close$}
              >
                <BsX size={17} />
              </Button>
            </Tooltip>
          </ZoomButtonRow>
        </div>
        <ZoomDisplay>
          <img class={dialog__image} src={props.imageSrc$} />
        </ZoomDisplay>
      </ZoomAndPanProvider>
    </DialogContent>
  )
}