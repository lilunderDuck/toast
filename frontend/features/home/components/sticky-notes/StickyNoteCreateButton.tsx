import stylex from "@stylexjs/stylex"
import { BsPlus } from "solid-icons/bs"

const style = stylex.create({
  block: {
    width: "13.5rem",
    height: "12rem",
    borderRadius: 6,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "var(--mantle)",
    color: "var(--subtext0)",
    ":hover": {
      backgroundColor: "var(--base)",
      color: "var(--text)",
    }
  }
})

interface IStickyNoteCreateButtonProps {
  // define your component props here
}

export function StickyNoteCreateButton(props: IStickyNoteCreateButtonProps) {
  return (
    <button {...stylex.attrs(style.block)}>
      <BsPlus size={30} />
    </button>
  )
}