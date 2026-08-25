import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components"
import { NoteList, NotePageProvider, NoteTopHeaderBar } from "~/features/notes"

const home = css`
  width: 100%;
  height: 100%;
  padding-inline: 10px;
`

const home__titleBar = css`
  gap: 10px;
  width: 100%;
  padding-inline: 5px;
`

export default function Home() {
  return (
    <NotePageProvider>
      <div class={home}>
        <AppTitleBarDraggable class={home__titleBar} />
        <NoteTopHeaderBar />
        <NoteList />
      </div>
    </NotePageProvider>
  )
}
