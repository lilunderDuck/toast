import { createSignal } from 'solid-js'
// ...
import { IJournalData } from '~/api/journal'
import { createLazyLoadedDialog } from '~/components'
// ...
import { useJournalContext } from '../../context'

export default function SidebarActions() {
  const { event$, journal$, localStorage$ } = useJournalContext()
  const [thingToDelete, setThingToDelete] = createSignal<IJournalData>()
  const deleteJournalModal = createLazyLoadedDialog(
    () => import('./modals/DeleteJournalModal'), 
    () => ({
      journal$: thingToDelete()!
    })
  )

  event$.on$('journal__openJournal', (journal) => {
    journal$.open$(journal.id)
    journal$.setCurrentlyOpened$(journal)
  })
  
  event$.on$('journal__deleteJournal', (journal) => {
    const deleteRightAway = localStorage$.get$('shouldShowDeleteConfirmationModal')
    console.log('should delete right away?', deleteRightAway)
    if (deleteRightAway) {
      return journal$.delete$(journal.id)
    }

    setThingToDelete(journal)
    deleteJournalModal.show$()
  })
  return (
    <>
      <deleteJournalModal.Modal$ />
    </>
  )
}