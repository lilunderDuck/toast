import { For } from "solid-js"
// ...
import { css } from "molcss"
import "../core/JournalHomeRoot.css"
// ...
import { StickyNoteBlock, StickyNoteCreateButton, StickyNoteProvider } from "../components"
import { StickyNotesProvider, useStickyNotesContext } from "../provider/StickyNotesProvider"

const note__list = css`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 13.5rem);
  grid-template-rows: repeat(auto-fill, 12rem);
  gap: 10px;
  margin-top: 10px;
`

export default function StickyNotes() {
  const NoteList = () => {
    const { data$ } = useStickyNotesContext()
    return (
      <For each={data$()}>
        {it => (
          <StickyNoteProvider data$={it}>
            <StickyNoteBlock />
          </StickyNoteProvider>
        )}
      </For>
    )
  }

  return (
    <StickyNotesProvider>
      <main class="journalHome__mainContent">
        <h1>Sticky notes</h1>
        <div class={note__list}>
          <NoteList />
          <StickyNoteCreateButton />
        </div>
      </main>
    </StickyNotesProvider>
  )
}