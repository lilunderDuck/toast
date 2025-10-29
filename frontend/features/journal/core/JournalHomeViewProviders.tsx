import { Show, type ParentProps } from "solid-js"
import { JournalProvider, useJournalContext, type IFileExplorerProviderOptions } from "../provider"
import { UpdateGroup } from "~/wailsjs/go/group/Exports"
import { EditorProvider } from "~/features/editor"
import { File, Folder, JournalLoadingScreen } from "../components"
import type { group } from "~/wailsjs/go/models"

interface IJournalHomeProvidersProps {
  groupId$: string
  explorerTreeData$: () => group.ExplorerData
  isLoading$: boolean
}

export function JournalHomeViewProviders(props: ParentProps<IJournalHomeProvidersProps>) {
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
      return props.explorerTreeData$()
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
      <Show when={!props.isLoading$} fallback={<JournalLoadingScreen />}>
        <JournalProvider explorerOptions$={fileExplorerOption}>
          <Loader />
          {props.children}
        </JournalProvider>
      </Show>
    </EditorProvider>
  )
}