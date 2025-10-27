import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalListSection.module.css"
// ...
import { CreateJournalButton, JournalBlock, JournalListHeader } from "../components"
import { useJournalHomeContext } from "../provider"

const style = stylex.create({
  section: {
    paddingInline: "2rem",
    paddingTop: "1rem",
    overflowY: "auto",
    height: "100%"
  },
  section__list: {
    gap: 10,
    flexWrap: "wrap",
    display: "flex"
  }
})

interface IJournalListSectionProps {
}

export function JournalListSection(props: IJournalListSectionProps) {
  const { groups$ } = useJournalHomeContext()

  return (
    <section {...stylex.attrs(style.section)}>
      <JournalListHeader name$="Your journal" />
      <div {...stylex.attrs(style.section__list)} id={__style.list}>
        <For each={groups$()}>
          {it => <JournalBlock {...it} />}
        </For>
        <CreateJournalButton />
      </div>
    </section>
  )
}