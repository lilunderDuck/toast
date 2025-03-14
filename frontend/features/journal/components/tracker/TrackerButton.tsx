import { BsTrello } from "solid-icons/bs"
// ...
import { createLazyLoadedDialog } from "~/components"
// ...
import { QuickActionItem } from "../quick-action-bar"

export function TrackerButton() {
  const toolModal = createLazyLoadedDialog(
    () => import('./TrackingToolsModal')
  )

  return (
    <>
      <QuickActionItem 
        icon$={BsTrello}
        label$='Trackers'
        onClick={toolModal.show$}
      />
      <toolModal.Modal$ />
    </>
  )
}