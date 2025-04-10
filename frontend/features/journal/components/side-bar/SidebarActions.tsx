import { createSignal } from 'solid-js'
// ...
import { IJournalData } from '~/api/journal'
import { createLazyLoadedDialog } from '~/components'
// ...
import { useJournalContext } from '../../context'

export default function SidebarActions() {
  const { event$: journalEvent, journal$, localStorage$, tabs$ } = useJournalContext()

  const [thingToDelete, setThingToDelete] = createSignal<IJournalData>()
  const deleteJournalModal = createLazyLoadedDialog(
    () => import('./modals/DeleteJournalModal'), 
    () => ({
      journal$: thingToDelete()!
    })
  )

  journalEvent.on$('journal__openJournal', (journal) => {
    tabs$.update$(journal.id)
  })
  
  journalEvent.on$('journal__deleteJournal', (journal) => {
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