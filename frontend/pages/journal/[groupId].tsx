import { onCleanup, ParentProps } from "solid-js"
import { Root, Panel, Handle } from '@corvu/resizable'
import { useParams } from "@solidjs/router"
// ...
import stylex from "@stylexjs/stylex"
import __style from "~/features/journal/styles/index.module.css"
// ...
import { FileExplorer, FileExplorerProvider, IFileExplorerProviderProps } from "~/features/explorer"
import { CurrentlyOpened, File, Folder, QuickActionBar, TopHeaderButtonRow, JournalProvider, useJournalContext } from "~/features/journal"
import { EditorProvider } from "~/features/editor"
import { AppTitleBarButton, AppTitleBarDraggable, Spacer } from "~/components"
import { UpdateExplorerTree } from "~/wailsjs/go/journal/GroupExport"
// ...

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
    height: "100%",
    width: "100%"
  },
  home__titleBar: {
    position: "absolute",
    paddingLeft: 10
  }
})

export default function JournalHome(props: ParentProps) {
  const param = useParams()

  document.body.classList.add(__style.journal)
  onCleanup(() => document.body.classList.remove(__style.journal))

  const currentGroupId = () => parseInt(param.groupId)

  const Loader = () => {
    const { sessionStorage$ } = useJournalContext()
    sessionStorage$.set$('journal_data$', {
      groupId$: currentGroupId()
    })

    return <></>
  }

  return (
    <Providers groupId$={currentGroupId()}>
      <Loader />
      <Root {...stylex.attrs(style.home)} id={__style.journal}>
        <Panel {...stylex.attrs(style.home__sidebarPanel)} initialSize={0.3}>
          <TopHeaderButtonRow {...stylex.attrs(style.home__header)} />
          <QuickActionBar>
            <FileExplorer />
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
  const fileExplorerOption: IFileExplorerProviderProps = {
    components$: {
      File$: (fileProps) => <File
        groupId$={props.groupId$}
        journalId$={fileProps.id}
      />,
      Folder$: (props) => (
        <Folder
          folderId$={props.id}
          onClick={props.onClick}
        >
          {props.children}
        </Folder>
      )
    },
    getDataMapping$() {
      return {}
    },
    onTreeUpdate$(newTree) {
      UpdateExplorerTree(props.groupId$, newTree)
    }
  }

  return (
    <FileExplorerProvider {...fileExplorerOption}>
      <EditorProvider id$={props.groupId$}>
        <JournalProvider>
          {props.children}
        </JournalProvider>
      </EditorProvider>
    </FileExplorerProvider>
  )
}