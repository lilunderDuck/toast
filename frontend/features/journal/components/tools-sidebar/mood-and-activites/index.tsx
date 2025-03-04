import stylex from "@stylexjs/stylex"
import __style from "./index.module.css"
// ...
import { CalendarProvider, MonthCalendar } from "./MonthCalendar"
import ActivitesTracker from "./ActivitesTracker"

const style = stylex.create({
  tool: {
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '1fr 1fr'
  },
  currentMonth: {
    fontSize: 14
  },
  smallBlockList: {
    gap: 5
  },
  smallBlock: {
    width: 15,
    height: 15,
    backgroundColor: 'var(--block-bg)',
    borderRadius: 4
  }
})

export default function MoodAndActivitesTool() {
  return (
    <div {...stylex.attrs(style.tool)} id={__style.tool}>
      <CalendarProvider>
        <ActivitesTracker />

        <section>
          <h2>Mood tracker</h2>
          <MonthCalendar />
        </section>
      </CalendarProvider>
    </div>
  )
}