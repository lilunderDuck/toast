import stylex from "@stylexjs/stylex"
import { BsCardHeading } from "solid-icons/bs"
// ...
import { FlexCenterY } from "~/components"
// ...
import { 
  NotResizableTabPanel, 
  ToolButton, 
  ToolContent 
} from "../components"

const style = stylex.create({
  sidebar: {
    width: '35%'
  },
  titleBar: {
    paddingInline: 5
  }
})

export function JournalToolsSidebar() {
  return (
    <NotResizableTabPanel {...stylex.attrs(style.sidebar)}>
      <FlexCenterY {...stylex.attrs(style.titleBar)}>
        <ToolButton $icon={BsCardHeading} $label="Table of contents" />
      </FlexCenterY>
      <ToolContent />
    </NotResizableTabPanel>
  )
}