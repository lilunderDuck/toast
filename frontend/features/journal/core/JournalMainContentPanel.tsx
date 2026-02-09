import type { ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { JournalContentPanelProvider } from "../provider"
import { JournalContentPanel } from "./JournalContentPanel"

const style = stylex.create({
  home__contentPanel: {
    backgroundColor: "var(--content-panel-bg)",
    position: "relative",
    paddingInline: 20
  }
})

interface IJournalMainContentPanelProps {
  // define your component props here
}

export function JournalMainContentPanel(props: ParentProps<IJournalMainContentPanelProps>) {
  return (
    <div
      {...stylex.attrs(style.home__contentPanel)}
      data-journal-main-content-panel=""
    >
      <JournalContentPanelProvider tabPanelId$="1">
        <JournalContentPanel>
          {props.children}
        </JournalContentPanel>
      </JournalContentPanelProvider>
    </div>
  )
}