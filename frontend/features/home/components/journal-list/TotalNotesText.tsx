import { css } from "molcss"
// ...
import { useNoteHomeContext } from "../../provider/NoteHomeProvider"

const text__count = css`
  color: var(--blue);
`

export function TotalNotesText() {
  const { groups$ } = useNoteHomeContext()
  return (
    <div>
      <span class={text__count}>{groups$().length}</span> in total
    </div>
  )
}