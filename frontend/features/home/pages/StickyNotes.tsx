import stylex from "@stylexjs/stylex"
import { StickyNoteBlock, StickyNoteCreateButton } from "../components"
import { StickyNoteProvider } from "../components/sticky-notes/StickyNoteProvider"

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
  return (
    <main id="journalHome__mainContent">
      <h1>Sticky notes</h1>
      <div {...stylex.attrs(style.note__list)}>
        <StickyNoteProvider data$={{
          title: "hello",
          content: "This is a test!",
          color: "#ffffff"
        }}>
          <StickyNoteBlock />
        </StickyNoteProvider>
        <StickyNoteProvider data$={{
          title: "world",
          content: "Sticky note is used to temporary note something. It's not meant to be used as another way to save your novel or something."
        }}>
          <StickyNoteBlock />
        </StickyNoteProvider>
        <StickyNoteCreateButton />
      </div>
    </main>
  )
}