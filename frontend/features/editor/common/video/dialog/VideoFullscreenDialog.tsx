import { DialogContent, type IDialog } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Video } from "../ui"
import { IVideoBlockData } from "../data"

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
        fullScreenMode$={true}
      >
        {/**Empty element, to avoid file dialog accidentally being shown by clicking
          * anywhere on the video.
          */}
        <></>
      </Video>
    </DialogContent>
  )
}