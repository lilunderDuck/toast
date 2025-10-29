import { onCleanup, type ParentProps } from "solid-js"
import { Root, Panel, Handle } from '@corvu/resizable'
import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./[groupId].module.css"
// ...
import {
  QuickActionBar,
  TopHeaderButtonRow,
  FileExplorerRenderer,
  JournalHomeViewProviders,
  JournalContentPanel,
  JournalContentPanelProvider
} from "~/features/journal"
// ...
import journalGroupData from "./[groupId].data"

const style = stylex.create({
  home: {
    width: "100%",
    height: "100%"
  },
  home__sidebarPanel: {
    backgroundColor: "var(--sidebar-panel-bg)"
  },
  home__contentPanel: {
    backgroundColor: "var(--content-panel-bg)",
    position: "relative",
    // display: "grid",
    // gridTemplateColumns: "1fr 0.7fr"
  },
  home__resizePanelHandle: {
    backgroundColor: "transparent",
    padding: 2,
    outline: "none",
    ":hover": {
      backgroundColor: "var(--blue8) !important",
    }
  },
  home__header: {
    height: "var(--top-header-height)"
  },
  home__mainContent: {
    height: "calc(100% - var(--top-header-height))",
    width: "100%",
  },
})

export default function JournalHome(props: ParentProps) {
  const param = useParams()
  const currentGroupId = () => param.groupId

  const bodyClassList = document.body.classList
  bodyClassList.add(__style.journal)
  onCleanup(() => {
    bodyClassList.remove(__style.journal, __style.journalFullview)
  })

  const journalData = journalGroupData(currentGroupId())

  return (
    <JournalHomeViewProviders
      groupId$={currentGroupId()}
      explorerTreeData$={() => journalData()?.explorerTreeData$!}
      isLoading$={!journalData()}
    >
      <Root {...stylex.attrs(style.home)}>
        <Panel
          {...stylex.attrs(style.home__sidebarPanel)}
          initialSize={0.3}
          data-journal-side-bar-panel=""
        >
          <TopHeaderButtonRow {...stylex.attrs(style.home__header)} />
          <QuickActionBar>
            <FileExplorerRenderer />
          </QuickActionBar>
        </Panel>
        <Handle {...stylex.attrs(style.home__resizePanelHandle)} />
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
      </Root>
    </JournalHomeViewProviders>
  )
}