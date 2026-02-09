import { onCleanup, Show, type ParentProps } from "solid-js"
// ...
import { CleanUpJournal } from "~/wailsjs/go/journal/Exports"
import type { group } from "~/wailsjs/go/models"
import { EditorProvider } from "~/libs/editor"
// ...
import { JournalProvider, useJournalContext } from "../provider"

interface IJournalHomeProvidersProps {
  groupId$: string
  explorerTreeData$: () => group.ExplorerData
  isLoading$: boolean
}

export function JournalHomeViewProviders(props: ParentProps<IJournalHomeProvidersProps>) {
  onCleanup(() => {
    CleanUpJournal(props.groupId$)
  })

  const Loader = () => {
    const { sessionStorage$ } = useJournalContext()
    sessionStorage$.set$('journal_data$', { groupId$: props.groupId$ })

    return <></>
  }

  return (
    <EditorProvider id$={props.groupId$}>
      <Show when={!props.isLoading$}>
        <JournalProvider>
          <Loader />
          {props.children}
        </JournalProvider>
      </Show>
    </EditorProvider>
  )
}