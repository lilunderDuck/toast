import { type ParentProps } from "solid-js"
import { Handle } from '@corvu/resizable'
import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./[groupId].module.css"
// ...
import {
  JournalHomeViewProviders,
  JournalSidebarPanel,
  JournalMainContentPanel,
  JournalRootPanel
} from "~/features/journal"
// ...
import journalGroupData from "./[groupId].data"

const style = stylex.create({
  home__resizePanelHandle: {
    backgroundColor: "transparent",
    padding: 2,
    outline: "none",
    ":hover": {
      backgroundColor: "var(--blue8) !important",
    }
  },
})

export default function JournalPage(props: ParentProps) {
  const param = useParams()
  const currentGroupId = () => param.groupId!

  const journalData = journalGroupData(currentGroupId())

  return (
    <JournalHomeViewProviders
      groupId$={currentGroupId()}
      explorerTreeData$={() => journalData()?.explorerTreeData$!}
      isLoading$={!journalData()}
    >
      <JournalRootPanel>
        <JournalSidebarPanel />
        <Handle {...stylex.attrs(style.home__resizePanelHandle)} />
        <JournalMainContentPanel>
          {props.children}
        </JournalMainContentPanel>
      </JournalRootPanel>
    </JournalHomeViewProviders>
  )
}