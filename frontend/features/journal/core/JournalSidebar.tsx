import { BsHouseFill } from "solid-icons/bs"
import { useNavigate, useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./JournalSidebar.module.css"
// ...
import { 
  FlexCenterY, 
  ResizableHandle, 
  ResizablePanel,
  Spacer
} from "~/components"
import { FileDisplay, FileDisplayProvider, FileNodeType } from "~/features/file-display"
import { 
  api_getAllJournal, 
  api_getJournalVirturalFileTree, 
  api_updateJournalVirturalFileTree, 
  type IJournalCategoryData, 
  type IJournalData 
} from "~/api/journal"
// ...
import { 
  Journal,
  JournalCategory,
  QuickActionItem, 
  Sidebar,
  SidebarButtonsRow,
} from "../components"
import { useJournalContext } from "../context"

const style = stylex.create({
  sidebar: {
    width: '100%',
    height: '100%'
  },
  titleBar: {
    padding: 5,
    gap: 5,
    height: "var(--journal-header)"
  }
})

export function JournalSidebar() {
  const { journal$ } = useJournalContext()
  const goTo = useNavigate()
  const goHome = () => goTo('/')
  const param = useParams()

  const currentGroupId = parseInt(param.id)

  return (
    <>
      <ResizablePanel initialSize={0.3}>
        <FlexCenterY id={__style.iconTitleBar} {...stylex.attrs(style.titleBar)}>
          <QuickActionItem 
            icon$={BsHouseFill}
            label$='Go back to home'
            onClick={goHome}
          />
          <Spacer />
          <SidebarButtonsRow />
        </FlexCenterY>
        <FileDisplayProvider<IJournalData, IJournalCategoryData> 
          // @ts-ignore
          FileComponent$={Journal}
          // @ts-ignore
          FolderComponent$={JournalCategory}
          load$={async() => {
            return {
              tree$: await api_getJournalVirturalFileTree(currentGroupId),
              dataMapping$: await api_getAllJournal(currentGroupId)
            }
          }}
          onOpen$={(type, data) => {
            if (type === FileNodeType.FILE && journal$.currentlyOpened$()?.id !== data.id) {
              journal$.open$(data.id)
            }
            console.log("open", type, data)
          }}
          onUpdate$={(treeData) => {
            api_updateJournalVirturalFileTree(currentGroupId, treeData)
          }}
        >
          <Sidebar>
            <FileDisplay />
          </Sidebar>
        </FileDisplayProvider>
      </ResizablePanel>
      <ResizableHandle />
    </>
  )
}