import { onCleanup, type ParentProps, Show } from "solid-js"
import { Root, Panel, Handle } from '@corvu/resizable'
import { redirect, useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "./[groupId].module.css"
// ...
import {
  CurrentlyOpened,
  File,
  Folder,
  QuickActionBar,
  TopHeaderButtonRow,
  JournalProvider,
  useJournalContext,
  FileExplorerRenderer,
  type IFileExplorerProviderOptions,
  JournalLoadingScreen,
  type ICurrentlyOpenedProps
} from "~/features/journal"
import { CharacterCount, EditorProvider } from "~/features/editor"
import { AppTitleBarDraggable } from "~/components"
import { UpdateGroup } from "~/wailsjs/go/group/Exports"
import { useToggle } from "~/hooks"
import type { group, journal } from "~/wailsjs/go/models"
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
    position: "relative"
  },
  home__contentPanelFullView: {
    flexBasis: "100% !important",
    paddingInline: "15rem"
  },
  home__resizePanelHandle: {
    backgroundColor: "transparent",
    padding: 2,
    outline: "none",
    ":hover": {
      backgroundColor: "var(--blue8) !important",
    }
  },
  home__sideBarHeader: {
    paddingInline: 10
  },
  home__header: {
    height: "var(--top-header-height)"
  },
  home__mainContent: {
    height: "calc(100% - 35px)",
    width: "100%",
    marginTop: 35
  },
  home__titleBar: {
    position: "absolute",
    paddingLeft: 10
  }
})

export default function JournalHome(props: ParentProps) {
  const param = useParams()
  const currentGroupId = () => parseInt(param.groupId)

  const bodyClassList = document.body.classList
  bodyClassList.add(__style.journal)
  onCleanup(() => {
    bodyClassList.remove(__style.journal, __style.journalFullview)
  })

  const [isSidebarHidden, toggleHideSidebar] = useToggle()

  const topHeaderButtons: ICurrentlyOpenedProps["onClick$"] = (whichOne) => {
    switch (whichOne) {
      case CurrentlyOpenedHeaderAction.GO_BACK_TO_HOME: return redirect(`/journal/${currentGroupId()}`)
      case CurrentlyOpenedHeaderAction.TOGGLE_SIDEBAR:
        toggleHideSidebar()
        isSidebarHidden() ? bodyClassList.add(__style.journalFullview) : bodyClassList.remove(__style.journalFullview)
        return
    }
  }

  const JournalMainContent = () => {
    const { currentlyOpenedJournal$ } = useJournalContext()
    return (
      <>
        <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)}>
          <CurrentlyOpened
            onClick$={topHeaderButtons}
            isSidebarHidden$={isSidebarHidden()}
            currentlyOpenedName$={currentlyOpenedJournal$()}
            groupId$={currentGroupId()}
          />
        </AppTitleBarDraggable>
        <CharacterCount>
          {!currentlyOpenedJournal$() ? (<span>*Nothing*</span>) : undefined}
        </CharacterCount>
        <main {...stylex.attrs(style.home__mainContent)}>
          {props.children}
        </main>
      </>
    )
  }

  return (
    <JournalHomeProviders groupId$={currentGroupId()}>
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
          <JournalMainContent />
        </Panel>
      </Root>
    </JournalHomeProviders>
  )
}

interface IJournalHomeProvidersProps {
  groupId$: number
}

function JournalHomeProviders(props: ParentProps<IJournalHomeProvidersProps>) {
  const journalData = journalGroupData(props.groupId$)

  const fileExplorerOption: IFileExplorerProviderOptions = {
    components$: {
      File$: (fileProps) => (
        <File
          groupId$={props.groupId$}
          journalId$={fileProps.id}
          name$={fileProps.name}
        />
      ),
      Folder$: (props) => (
        <Folder
          folderId$={props.id}
          onClick={props.onClick}
          name$={props.name}
        >
          {props.children}
        </Folder>
      )
    },
    getData$() {
      return journalData()!.explorerTreeData$
    },
    onTreeUpdate$(newTree) {
      UpdateGroup(props.groupId$, { tree: newTree } as group.JournalGroupOptions)
    }
  }

  const Loader = () => {
    const { sessionStorage$ } = useJournalContext()
    sessionStorage$.set$('journal_data$', { groupId$: props.groupId$ })

    return <></>
  }

  return (
    <EditorProvider id$={props.groupId$}>
      <Show when={journalData()} fallback={<JournalLoadingScreen />}>
        <JournalProvider explorerOptions$={fileExplorerOption}>
          <Loader />
          {props.children}
        </JournalProvider>
      </Show>
    </EditorProvider>
  )
}