import { Accessor, createContext, createSignal, For, ParentProps, Signal, useContext } from "solid-js"
// ...
import __style from "./MonthCalendar.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { FlexCenter } from "~/components"
import { mergeClassname } from "~/utils"
import { 
  getCurrentMonthAndYear, 
  getDaysInMonth,
  getMonthName, 
  ThisYearsCurrentTime 
} from "~/features/journal"

const style = stylex.create({
  blockList: {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, var(--block-bound))',
    gap: 5
  },
  calendarBlock: {
    backgroundColor: 'var(--block-bg)',
    width: 'var(--block-bound)',
    height: 'var(--block-bound)',
    transition: 'opacity 0.15s ease-out',
    cursor: 'pointer',
    fontSize: 12,
    borderRadius: 5,
    outline: '2px solid transparent',
  },
  selectedBlock: {
    outlineColor: '#369bee'
  },
  currentDate: {
    outlineColor: '#eeae36 !important'
  },
  future: {
    backgroundColor: 'var(--gray5)'
  }
})

interface ITrackingTime {
  $currentTime: ThisYearsCurrentTime
  $allDaysInThatMonth: Date[]
  $selectedDate: Signal<Date>
}

export interface IThisCalendarIdk extends ITrackingTime {
  $getFormatedCurrentMonth(): string
}

const Context = createContext<IThisCalendarIdk>()
export function CalendarProvider(props: ParentProps) {
  const $currentTime = getCurrentMonthAndYear()
  const $allDaysInThatMonth = getDaysInMonth($currentTime.month, $currentTime.year)
  const $getFormatedCurrentMonth = () => `${getMonthName($currentTime.month)}, ${$currentTime.year}`
  const [selectedDate, setSelectedDate] = createSignal() as ITrackingTime['$selectedDate']

  setSelectedDate(new Date())

  return (
    <Context.Provider value={{
      $currentTime,
      $allDaysInThatMonth,
      $getFormatedCurrentMonth,
      $selectedDate: [selectedDate, setSelectedDate]
    }}>
      {props.children}
    </Context.Provider>
  )
}

export const useCalendarContext = () => useContext(Context)!

export interface IMonthCalendarProps {
  highlight?: (currentDate: number) => string
}

export function MonthCalendar(props: IMonthCalendarProps) {
  const { $selectedDate, $currentTime, $allDaysInThatMonth } = useCalendarContext()
  const [selectedDate, setSelectedDate] = $selectedDate
  const isCurrentDate = (someDate: Date) => 
    someDate.getDate() === $currentTime.day
  // ...

  const isSomeDateInTheFuture = (someDate: Date) => 
    someDate.getDate() > $currentTime.day
  // ...

  const isSomeDateSelected = (someDate: Date, selectedDate: Accessor<Date>) => 
    someDate.getDate() === selectedDate().getDate() &&
    selectedDate().getDate() !== $currentTime.day
  // ...

  return (
    <div {...stylex.attrs(style.blockList)} id={__style.blockList}>
      <For each={$allDaysInThatMonth}>
        {it => (
          <FlexCenter 
            class={mergeClassname(
              stylex.attrs(
                style.calendarBlock,
                isCurrentDate(it) ? style.currentDate : {},
                isSomeDateInTheFuture(it) ? style.future : {},
                isSomeDateSelected(it, selectedDate) ? style.selectedBlock : {}
              ),
              __style.block, 
              props.highlight?.(it.getDate()) ?? ''
            )}
            onMouseEnter={() => setSelectedDate(it)}
            onMouseLeave={() => setSelectedDate(new Date())}
          >
            {it.getDate()}
          </FlexCenter>
        )}
      </For>
    </div>
  )
}