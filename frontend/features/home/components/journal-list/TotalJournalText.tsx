import { css } from "molcss"
// ...
import { useJournalHomeContext } from "../../provider/JournalHomeProvider"

const text__count = css`
  color: var(--blue);
`

export function TotalJournalText() {
  const { groups$ } = useJournalHomeContext()
  return (
    <div>
      <span class={text__count}>{groups$().length}</span> in total
    </div>
  )
}