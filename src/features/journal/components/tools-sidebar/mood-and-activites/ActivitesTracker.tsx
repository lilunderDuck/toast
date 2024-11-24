import { Flex, Spacer } from "~/components"
import { IMonthCalendarProps, MonthCalendar, useCalendarContext } from "./MonthCalendar"
import __style from "./index.module.css"
import stylex from "@stylexjs/stylex"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  tool: {
    width: '100%',
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

export default function ActivitesTracker() {
  const { $getFormatedCurrentMonth, $selectedDate, $currentTime } = useCalendarContext()
  const [selectedDate] = $selectedDate
  
  const sampleData: Record<string, any[] | undefined> = {
    1: new Array(3),
    4: new Array(2),
    10: new Array(1),
    6: new Array(8)
  }

  const getActivitiesCount = (byDay: number) => {
    return sampleData[byDay]?.length
  }

  const getSummaryText = (someDate: Date) => {
    const selectedDay = someDate.getDate()
    if (selectedDay === $currentTime.day) {
      return `There is no activity, for now...` as const
    }

    if (selectedDay > $currentTime.day) {
      return `There is no activity because you have time traveled too far :)` as const
    }

    const count = getActivitiesCount(selectedDay)
    const formatedDate = someDate.toDateString()
    if (!count || count === 0) {
      return `There is no activity during ${formatedDate}` as const
    }

    return `There ${count > 1 ? 'are' : 'is'} ${count} activit${count > 1 ? 'ies' : 'y'} during ${formatedDate}` as const
  }

  const highlightDate: IMonthCalendarProps['highlight'] = (currentDate) => {
    const amountOfActivites = getActivitiesCount(currentDate)
    if (!amountOfActivites) {
      return ''
    }

    if (amountOfActivites >= 6) {
      return __style.veryActive
    }

    if (amountOfActivites >= 3) {
      return __style.active
    }

    return __style.leastActive
  }

  return (
    <section>
      <h2>Activites</h2>
      <div {...stylex.attrs(style.currentMonth)}>
        All of activites in {$getFormatedCurrentMonth()}
      </div>
      <div {...stylex.attrs(style.currentMonth)}>
        <MonthCalendar 
          highlight={highlightDate}
        />
        <Flex {...stylex.attrs(style.smallBlockList)}>
          <Spacer />
          <div class={mergeClassname(stylex.attrs(style.smallBlock), __style.leastActive)} />
          <div class={mergeClassname(stylex.attrs(style.smallBlock), __style.active)} />
          <div class={mergeClassname(stylex.attrs(style.smallBlock), __style.veryActive)} />
        </Flex>
        <div>
          {getSummaryText(selectedDate())}
        </div>
      </div>
    </section>
  )
}