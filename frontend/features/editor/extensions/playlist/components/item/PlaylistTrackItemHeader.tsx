import { macro_mergeClassnames } from "macro-def"
// ...
import __style from "./PlaylistTrackItem.module.css"
import stylex from "@stylexjs/stylex"

const style = stylex.create({
  header: {
    paddingInline: 15,
    gap: 15,
    userSelect: "none",
    fontSize: 13,
    fontWeight: "bold",
    paddingBottom: 5,
    borderBottom: "2px solid var(--gray3)"
  },
  header__index: {
    marginLeft: "0.5rem"
  },
  header__trackText: {
    marginLeft: "1rem"
  }
})

export function PlaylistTrackItemHeader() {
  return (
    <div class={macro_mergeClassnames(stylex.attrs(style.header), __style.itemHeader)}>
      <span {...stylex.attrs(style.header__index)}>#</span>
      <div />
      <span {...stylex.attrs(style.header__trackText)}>Track</span>
      <span>Duration</span>
    </div>
  )
}