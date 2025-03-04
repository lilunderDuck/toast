import { BsTrello } from "solid-icons/bs"
import { lazy } from "solid-js"
// ...
import { createLazyLoadedDialog } from "~/components"
// ...
import { QuickActionItem } from "../quick-action-bar"

export function TrackerButton() {
  const toolModal = createLazyLoadedDialog(
    lazy(() => import('./TrackingToolsModal'))
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