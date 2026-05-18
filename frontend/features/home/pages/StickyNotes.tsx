import stylex from "@stylexjs/stylex"
import { StickyNoteBlock, StickyNoteCreateButton } from "../components"

const style = stylex.create({
  note__list: {
    width: "100%",
    height: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 13.5rem)",
    gridTemplateRows: "repeat(auto-fill, 12rem)",
    gap: 10
  }
})

export default function StickyNotes() {
  return (
    <main id="journalHome__mainContent">
      <h1>Sticky notes</h1>
      <div {...stylex.attrs(style.note__list)}>
        <StickyNoteBlock color="#ffffff" />
        <StickyNoteBlock />
        <StickyNoteCreateButton />
      </div>
    </main>
  )
}