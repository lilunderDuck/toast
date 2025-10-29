import type { ParentProps } from "solid-js";
import { CurrentlyOpenedHeader, CurrentlyOpenedJournal, type ICurrentlyOpenedHeaderProps } from "../components";
import { useJournalContentPanelContext, useJournalContext } from "../provider";
import __style from "./JournalContentPanel.module.css"

import stylex from "@stylexjs/stylex"
import { CharacterCount } from "~/features/editor";

const style = stylex.create({
  panel__mainContent: {
    height: "calc(100% - var(--top-header-height))",
    width: "100%",
  }
})

interface IJournalContentPanelProps {
  // define your component props here
}

export function JournalContentPanel(props: ParentProps<IJournalContentPanelProps>) {
  const { sidebar$, sessionStorage$ } = useJournalContext()
  const { currentlyOpenedJournal$ } = useJournalContentPanelContext()
  const bodyClassList = document.body.classList
  const topHeaderButtons: ICurrentlyOpenedHeaderProps["onClick$"] = (whichOne) => {
    switch (whichOne) {
      case CurrentlyOpenedHeaderAction.TOGGLE_SIDEBAR:
        sidebar$.toggle$()
        sidebar$.isHidden$() ? 
          bodyClassList.add(__style.journalFullview) : 
          bodyClassList.remove(__style.journalFullview)
        return
    }
  }

  return (
    <section>
      <CurrentlyOpenedHeader
        onClick$={topHeaderButtons}
        isSidebarHidden$={sidebar$.isHidden$()}
        groupId$={sessionStorage$.get$("journal_data$").groupId$}
        id={__style.journalTitlebar}
      />
      <CurrentlyOpenedJournal 
        name$={currentlyOpenedJournal$()}
      />
      <CharacterCount>
        {!currentlyOpenedJournal$() ? (<span>Nothing</span>) : null}
      </CharacterCount>
      <main {...stylex.attrs(style.panel__mainContent)}>
        {props.children}
      </main>
    </section>
  )
}