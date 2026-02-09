import type { ParentProps } from "solid-js"
// ...
import { EditorCharacterCount } from "~/libs/editor"
// ...
import __style from "./JournalContentPanel.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { useJournalContentPanelContext } from "../provider"

const style = stylex.create({
  panel__mainContent: {
    height: "calc(100% - var(--top-header-height))",
    width: "100%",
    flexShrink: 0
  }
})

interface IJournalContentPanelProps {
  // define your component props here
}

export function JournalContentPanel(props: ParentProps<IJournalContentPanelProps>) {
  const { currentlyOpenedJournal$ } = useJournalContentPanelContext()

  return (
    <section>
      <EditorCharacterCount>
        {!currentlyOpenedJournal$() ? (<span>Nothing</span>) : null}
      </EditorCharacterCount>
      <main {...stylex.attrs(style.panel__mainContent)}>
        {props.children}
      </main>
    </section>
  )
}