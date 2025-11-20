import { Panel } from "@corvu/resizable";
import { FileExplorerRenderer, QuickActionBar, TopHeaderButtonRow } from "../components"
import stylex from "@stylexjs/stylex";

const style = stylex.create({
  sidebar: {
    backgroundColor: "var(--sidebar-panel-bg)"
  },
  sidebar__header: {
    height: "var(--top-header-height)"
  },
})

export function JournalSidebarPanel() {
  return (
    <Panel
      {...stylex.attrs(style.sidebar)}
      initialSize={0.3}
      data-journal-side-bar-panel=""
    >
      <TopHeaderButtonRow {...stylex.attrs(style.sidebar__header)} />
      <QuickActionBar>
        <FileExplorerRenderer />
      </QuickActionBar>
    </Panel>
  )
}