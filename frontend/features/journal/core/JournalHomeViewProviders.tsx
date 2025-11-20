import { onCleanup, Show, type ParentProps } from "solid-js"
// ...
import { UpdateGroup } from "~/wailsjs/go/group/Exports"
import { CleanUpJournal } from "~/wailsjs/go/journal/Exports"
import type { group } from "~/wailsjs/go/models"
import { EditorProvider } from "~/features/editor"
// ...
import { JournalProvider, useJournalContext, type IFileExplorerProviderOptions } from "../provider"
import { File, Folder, JournalLoadingScreen } from "../components"

interface IJournalHomeProvidersProps {
  groupId$: string
  explorerTreeData$: () => group.ExplorerData
  isLoading$: boolean
}

export function JournalHomeViewProviders(props: ParentProps<IJournalHomeProvidersProps>) {
  onCleanup(() => {
    CleanUpJournal(props.groupId$)
  })

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
      console.log("Tree update", newTree)
      UpdateGroup(props.groupId$, { explorer: newTree } as group.GroupOptions)
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