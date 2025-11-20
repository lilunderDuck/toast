import { Panel } from "@corvu/resizable"

import stylex from "@stylexjs/stylex"
import { JournalContentPanelProvider } from "../provider"
import { JournalContentPanel } from "./JournalContentPanel"
import type { ParentProps } from "solid-js"

const style = stylex.create({
  home__contentPanel: {
    backgroundColor: "var(--content-panel-bg)",
    position: "relative",
    // display: "grid",
    // gridTemplateColumns: "1fr 0.7fr"
  }
})

interface IJournalMainContentPanelProps {
  // define your component props here
}

export function JournalMainContentPanel(props: ParentProps<IJournalMainContentPanelProps>) {
  return (
    <Panel
      {...stylex.attrs(style.home__contentPanel)}
      initialSize={0.7}
      data-journal-main-content-panel=""
    >
      <JournalContentPanelProvider tabPanelId$="1">
        <JournalContentPanel>
          {props.children}
        </JournalContentPanel>
      </JournalContentPanelProvider>
    </Panel>
  )
}