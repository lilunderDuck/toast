import { Show } from "solid-js"
import { BsLayoutSidebar, BsLayoutSidebarInset } from "solid-icons/bs"
// ...
import { Button } from "~/components"
// ...
import { useJournalHomeRootContext } from "../provider/JournalHomeRootProvider"

export function ToggleHideSidebarButton() {
  const { isShowingSidebar$, _setIsShowingSidebar$ } = useJournalHomeRootContext()
  
  return (
    <Button 
      size$={ButtonSize.ICON}
      variant$={ButtonVariant.NO_BACKGROUND}
      onClick={() => _setIsShowingSidebar$(prev => !prev)}
    >
      <Show when={isShowingSidebar$()} fallback={
        <BsLayoutSidebar />
      }>
        <BsLayoutSidebarInset />
      </Show>
    </Button>
  )
}