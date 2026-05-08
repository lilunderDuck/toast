import { useJournalHomeContext } from "../../provider/JournalHomeProvider"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  text__count: {
    color: "var(--blue)"
  }
})

interface ITotalJournalTextProps {
  // define your component props here
}

export function TotalJournalText(props: ITotalJournalTextProps) {
  const { groups$ } = useJournalHomeContext()
  return (
    <div>
      <span {...stylex.attrs(style.text__count)}>{groups$().length}</span> in total
    </div>
  )
}