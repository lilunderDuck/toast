import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { StickyNoteBlock, StickyNoteCreateButton, StickyNoteProvider } from "../components"
import { StickyNotesProvider, useStickyNotesContext } from "../provider/StickyNotesProvider"

const style = stylex.create({
  note__list: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 13.5rem)",
    gridTemplateRows: "repeat(auto-fill, 12rem)",
    gap: 10,
    marginTop: 10
  }
})

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
      <main id="journalHome__mainContent">
        <h1>Sticky notes</h1>
        <div {...stylex.attrs(style.note__list)}>
          <NoteList />
          <StickyNoteCreateButton />
        </div>
      </main>
    </StickyNotesProvider>
  )
}