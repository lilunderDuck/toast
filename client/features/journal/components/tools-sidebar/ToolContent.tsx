import MoodAndActivitesTool from "./mood-and-activites"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  toolContent: {
    height: '100%',
    paddingInline: 10,
    paddingTop: 5
  }
})

export function ToolContent() {
  return (
    <div {...stylex.attrs(style.toolContent)} app-scollbar>
      <MoodAndActivitesTool />
    </div>
  )
}