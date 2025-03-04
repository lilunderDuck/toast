import { DialogContent, type IDialog } from "~/components"
// ...
import { ToolContent } from "../.."
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