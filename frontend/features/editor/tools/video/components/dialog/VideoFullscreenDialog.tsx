import { DialogContent, type IDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Video } from "../Video"
import type { IVideoBlockData } from "../../data"

interface IVideoFullscreenDialogProps extends IDialog {
  videoData$: IVideoBlockData
}

const style = stylex.create({
  dialogContent: {
    width: '100%',
    height: '100%',
    display: 'flex',
    backgroundColor: 'transparent !important'
  }
})

export default function VideoFullscreenDialog(props: IVideoFullscreenDialogProps) {
  return (
    <DialogContent {...stylex.attrs(style.dialogContent)}>
      <Video 
        {...props.videoData$} 
        showFullscreenButton$={false} 
        fullScreenMode$={true}
      />
    </DialogContent>
  )
}