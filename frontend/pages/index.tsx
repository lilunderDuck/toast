import { css } from "molcss"
// ...
import { AppTitleBarDraggable } from "~/components"
import { NotePageProvider } from "~/features/notes"
import NotePage from "~/features/notes/page/NotePage"

const home = css`
  width: 100%;
  height: 100%;
  padding-inline: 10px;
`

const home__titleBar = css`
  position: fixed;
  right: 0;
  gap: 10px;
  width: 100%;
  padding-inline: 5px;
`

export default function Home() {
  return (
    <div class={home}>
      <AppTitleBarDraggable class={home__titleBar} />
      <NotePageProvider>
        <NotePage />
      </NotePageProvider>
    </div>
  )
}
