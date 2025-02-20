import { createEffect, onMount } from "solid-js"
// ...
import { api_getGroup, api_getJournalVirturalFileTree, IJournalGroupData } from "~/api/journal"
import { useEditorContext } from "~/features/editor"
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
  const { fileDisplay$, sessionStorage$, localStorage$ } = useJournalContext()
  const { isReadonly$, setIsReadonly$ } = useEditorContext()
  const currentGroupId = parseInt(props.currentGroupId$)
  const [, setIsLoading] = fileDisplay$.isLoading$

  const updateFileDisplay = async(thisGroupData: IJournalGroupData) => {
    //debug-start
    journalLog.log('Updating file display and stuff')
    //debug-end

    const treeData = thisGroupData.tree.data
    // @ts-ignore - should work
    delete thisGroupData.tree
    sessionStorage$.set$('currentGroup', thisGroupData)
    
    const treeMapping = await api_getJournalVirturalFileTree(currentGroupId)
    fileDisplay$.setTree$(treeData, treeMapping)
  }

  const updateEditorReadonlyState = () => {
    //debug-start
    journalLog.log('Updating editor readonly state')
    //debug-end

    setIsReadonly$(
      localStorage$.get$(`readonly-${currentGroupId}`) ?? false
    )
  }

  onMount(async () => {
    //debug-start
    journalLog.group('Start up')
    //debug-end
    
    setIsLoading(true)
    // Attempt to get the journal group data from the backend
    const thisGroupData = await api_getGroup(currentGroupId) as IJournalGroupData
    if (!thisGroupData) {
      setIsLoading(false)
      return props.onError$()
    }

    await updateFileDisplay(thisGroupData)
    updateEditorReadonlyState()
    setIsLoading(false)

    //debug-start
    journalLog.log('Finish')
    journalLog.groupEnd()
    //debug-end
  })

  createEffect(() => {
    localStorage$.set$(`readonly-${currentGroupId}`, isReadonly$())
  })

  return (
    <></>
  )
}