import { DialogContent, type IDialog } from "client/components"
// ...
import { ToolContent } from "../../components"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  thisThing: {
    minWidth: '60vw'
  }
})

interface ITrackingToolsModal extends IDialog {
  // ...
}

export default function TrackingToolsModal(props: ITrackingToolsModal) {
  return (
    <DialogContent {...stylex.attrs(style.thisThing)}>
      <ToolContent />
    </DialogContent>
  )
}