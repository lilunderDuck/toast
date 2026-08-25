import { css } from "molcss"
import { CreateNoteButton, TagListButton } from "../components"
import { Input, Spacer } from "~/components"
import { useNoteHomeContext } from "../provider"

const header__root = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  user-select: none;
  & > div {
    flex-shrink: 0;
  }
`

const header__textCount = css`
  color: var(--blue);
`

export function NoteTopHeaderBar() {
  const { groups$ } = useNoteHomeContext()
  
  return (
    <header class={header__root}>
      <CreateNoteButton />
      <TagListButton />
      <Spacer />
      <Input placeholder="Search notes" />
      <div>
        <span class={header__textCount}>{groups$().length}</span> in total
      </div>
    </header>
  )
}