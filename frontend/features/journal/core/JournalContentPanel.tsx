import type { ParentProps } from "solid-js"
import { BsLayoutSidebarInset, BsWindow } from "solid-icons/bs"
// ...
import { EditorCharacterCount } from "~/features/editor"
import { Button } from "~/components"
// ...
import __style from "./JournalContentPanel.module.css"
import stylex from "@stylexjs/stylex"
// ...
import { useJournalContentPanelContext, useJournalContext } from "../provider"
import { CurrentlyOpenedHeader, CurrentlyOpenedJournal, type ICurrentlyOpenedHeaderProps } from "../components"

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
      >
        <Button 
          size$={ButtonSize.ICON} 
          variant$={ButtonVariant.NO_BACKGROUND}
          onClick={sidebar$.toggle$}
        >
          {sidebar$.isHidden$() ? <BsWindow /> : <BsLayoutSidebarInset />}
        </Button>
      </CurrentlyOpenedHeader>
      <CurrentlyOpenedJournal 
        name$={currentlyOpenedJournal$()}
      />
      <EditorCharacterCount>
        {!currentlyOpenedJournal$() ? (<span>Nothing</span>) : null}
      </EditorCharacterCount>
      <main {...stylex.attrs(style.panel__mainContent)}>
        {props.children}
      </main>
    </section>
  )
}