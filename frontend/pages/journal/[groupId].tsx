import { onCleanup, type ParentProps, Show } from "solid-js"
import { Root, Panel, Handle } from '@corvu/resizable'
import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "~/features/journal/styles/index.module.css"
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
  JournalLoadingScreen
} from "~/features/journal"
import { EditorProvider } from "~/features/editor"
import { AppTitleBarButton, AppTitleBarDraggable, Spacer } from "~/components"
import { SetExplorerTree } from "~/wailsjs/go/journal/GroupExport"
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
  home__resizePanelHandle: {
    backgroundColor: "transparent",
    padding: 2,
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

  document.body.classList.add(__style.journal)
  onCleanup(() => document.body.classList.remove(__style.journal))

  return (
    <Providers groupId$={currentGroupId()}>
      <Root {...stylex.attrs(style.home)} id={__style.journal}>
        <Panel {...stylex.attrs(style.home__sidebarPanel)} initialSize={0.3}>
          <TopHeaderButtonRow {...stylex.attrs(style.home__header)} />
          <QuickActionBar>
            <FileExplorerRenderer />
          </QuickActionBar>
        </Panel>
        <Handle {...stylex.attrs(style.home__resizePanelHandle)} />
        <Panel {...stylex.attrs(style.home__contentPanel)} initialSize={0.7}>
          <AppTitleBarDraggable {...stylex.attrs(style.home__titleBar)}>
            <CurrentlyOpened groupId$={currentGroupId()} />
            <Spacer />
            <AppTitleBarButton />
          </AppTitleBarDraggable>
          <main {...stylex.attrs(style.home__mainContent)}>
            {props.children}
          </main>
        </Panel>
      </Root>
    </Providers>
  )
}

function Providers(props: ParentProps<{ groupId$: number }>) {
  const journalData = journalGroupData(props.groupId$)

  const fileExplorerOption: IFileExplorerProviderOptions = {
    components$: {
      File$: (fileProps) => {
        console.dir(JSON.parse(JSON.stringify(fileProps)))
        return (
          <File
            groupId$={props.groupId$}
            journalId$={fileProps.id}
            name$={fileProps.name}
          />
        )
      },
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
      console.log("new tree:", newTree)
      SetExplorerTree(props.groupId$, newTree)
    }
  }

  const Loader = () => {
    const { sessionStorage$ } = useJournalContext()
    sessionStorage$.set$('journal_data$', {
      groupId$: props.groupId$
    })

    return <></>
  }

  return (
    <EditorProvider id$={props.groupId$}>
      <Show when={journalData()} fallback={
        <JournalLoadingScreen />
      }>
        <JournalProvider explorerOptions$={fileExplorerOption}>
          <Loader />
          {props.children}
        </JournalProvider>
      </Show>
    </EditorProvider>
  )
}