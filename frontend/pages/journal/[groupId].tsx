import { type ParentProps } from "solid-js"
import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./[groupId].module.css"
// ...
import {
  JournalHomeViewProviders,
  JournalMainContentPanel,
  JournalRootPanel,
  JournalTopHeader
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
  const journalData = journalGroupData().get$

  return (
    <JournalHomeViewProviders
      groupId$={journalGroupData().groupId$}
      explorerTreeData$={() => journalData()?.explorerTreeData$!}
      isLoading$={!journalData()}
    >
      <JournalRootPanel>
        <JournalTopHeader />
        <JournalMainContentPanel>
          {props.children}
        </JournalMainContentPanel>
      </JournalRootPanel>
    </JournalHomeViewProviders>
  )
}