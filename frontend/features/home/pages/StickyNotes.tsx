import { For } from "solid-js"
// ...
import { css } from "molcss"
import "../core/MainPageRoot.css"
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
  const { data$ } = useStickyNotesContext()

  return (
    <main class="journalHome__mainContent">
      <h1>Sticky notes</h1>
      <div class={note__list}>
        <For each={data$()}>
          {it => (
            <StickyNoteProvider data$={it}>
              <StickyNoteBlock />
            </StickyNoteProvider>
          )}
        </For>
        <StickyNoteCreateButton />
      </div>
    </main>
  )
}