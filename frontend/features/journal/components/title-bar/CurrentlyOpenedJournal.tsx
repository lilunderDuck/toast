import stylex from "@stylexjs/stylex"
import { Spacer } from "~/components"

const style = stylex.create({
  header: {
    height: 30,
    width: "100%",
    backgroundColor: "var(--content-panel-bg)",
    display: "flex",
    alignItems: "center",
    paddingInline: 20,
    userSelect: "none"
  },
  header__currentlyOpenedJournalText: {
    fontSize: 13
  }
})

interface ICurrentlyOpenedJournalProps {
  name$?: string
}

export function CurrentlyOpenedJournal(props: ICurrentlyOpenedJournalProps) {
  return (
    <header {...stylex.attrs(style.header)}>
      <Spacer />
      <span {...stylex.attrs(style.header__currentlyOpenedJournalText)}>
        {props.name$ ?? "New tab"}
      </span>
      <Spacer />
    </header>
  )
}