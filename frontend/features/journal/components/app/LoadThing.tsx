import { onMount } from "solid-js"
// ...
import { api_getGroup, type IJournalGroupData } from "~/api/journal"
import { journalLog } from "~/features/debug"
// ...
import { useJournalContext } from "../../context"

interface ILoadThingProps {
  currentGroupId$: string
  onError$(): void
}

/**This is a dummy component only to initialize everything it needs.
 * 
 * This is because it needs to access the `useJournalContext()` so it can set and mess it up.
 * @returns `JSX.Element`, but render nothing.
 */
export function LoadThing(props: ILoadThingProps) {
  const { sessionStorage$ } = useJournalContext()

  const CURRENT_GROUP_ID = parseInt(props.currentGroupId$)

  onMount(async () => {
    isDevMode && journalLog.group('Start up', CURRENT_GROUP_ID)
    
    // Attempt to get the journal group data from the backend
    const thisGroupData = await api_getGroup(CURRENT_GROUP_ID) as IJournalGroupData
    if (!thisGroupData) {
      return props.onError$()
    }

    sessionStorage$.set$("currentGroup", thisGroupData)

    // do a bunch of updating mess
    
    isDevMode && journalLog.log('Finish')
    journalLog.groupEnd()
  })

  return (
    <></>
  )
}