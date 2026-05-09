import { onCleanup, Show, type ParentProps } from "solid-js"
// ...
import type { group } from "~/wailsjs/go/models"
// ...
import { JournalProvider, useJournalContext } from "../provider"

interface IJournalHomeProvidersProps {
  groupId$: string
  explorerTreeData$: () => group.ExplorerData
  isLoading$: boolean
}

export function JournalHomeViewProviders(props: ParentProps<IJournalHomeProvidersProps>) {
  onCleanup(() => {
    // CleanUpJournal(props.groupId$)
  })

  const Loader = () => {
    const { sessionStorage$ } = useJournalContext()
    sessionStorage$.set$('journal_data$', { groupId$: props.groupId$ })

    return <></>
  }

  return (
    <Show when={!props.isLoading$}>
      <JournalProvider>
        <Loader />
        {props.children}
      </JournalProvider>
    </Show>
  )
}