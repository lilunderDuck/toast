import { createSignal } from "solid-js"
import { arrayObjects } from "~/utils"

type TabItemData = {
  tabId$: string
  isFocused$: boolean
}

export function createTabsManager() {
  const [items, setItems] = createSignal<TabItemData[]>([])
  let currentFocusedTab!: TabItemData

  const openTab = (tabId: string) => {
    const newTabData = currentFocusedTab?.tabId$ === tabId ? currentFocusedTab : {
      isFocused$: true,
      tabId$: tabId
    }

    setItems(prev => arrayObjects(prev).replace$(it => it.tabId$ === currentFocusedTab?.tabId$, newTabData))
  }

  return {
    openTab$: openTab
  }
}