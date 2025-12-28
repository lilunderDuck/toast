import { createSignal, For, Show, type VoidComponent } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
import { arrayObjects, createEvent, type IEvent } from "~/utils"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  tabList: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    outline: "none"
  },
  tabItem: {
    outline: "none",
    cursor: "pointer"
  }
})

type BaseTabData = { id: string }

type TabEventMap<T extends BaseTabData> = IEvent<{
  [TabEvent.CREATE]: (tabData: T) => any
  [TabEvent.UPDATE]: (allTabsData: T[]) => any
}>

export interface ITabComponentProps { 
  tabId$: string 
}

export function createTabs<T extends BaseTabData>(initialTabData?: T[]) {
  const [tabs, setTabs] = createSignal<T[]>([])
  const [focusedTabId, setFocusedTabId] = createSignal('')
  const [disabledTab, setDisabledTab] = createSignal(false)
  const tabEvent: TabEventMap<T> = createEvent()

  const setCurrentFocusedTab = (tab: string | T) => {
    let tabData = tab as T
    if (typeof tab === "string") {
      [tabData] = arrayObjects(tabs()).find$(it => it.id === tab)
      console.assert(tabData, `[tabs handler] tabs not found: ${tab}`)
    }

    currentFocusedTab = tabData
    setFocusedTabId(tabData.id)
    console.log('[tabs handler] focused tab:', tabData)
  }

  const updateTab = (tabId: number | string, newData: Partial<T>) => {
    setTabs(prev => [...arrayObjects(prev).replace$(it => it.id === tabId, newData)])
    tabEvent.emit$(TabEvent.UPDATE, tabs())
    console.log("[tabs handler] updated tab id:", tabId, newData)
  }

  const considerDragging: EventHandler<"section", "on:consider"> = (dragEvent) => {
    setTabs(dragEvent.detail.items as any[])
  }

  const finalizeDragging: EventHandler<"section", "on:finalize"> = (dragEvent) => {
    setTabs(dragEvent.detail.items as any[])
    tabEvent.emit$(TabEvent.UPDATE, tabs())
  }

  let currentFocusedTab: T | undefined
  const onClickingTab = (tabId: string) => {
    if (currentFocusedTab?.id === tabId) {
      return console.log("[tabs handler] already opened tab", tabId)
    }

    setCurrentFocusedTab(tabId)
    console.log("[tabs handler] click", tabId)
  }

  const setNewTabs = (newTabs: T[]) => {
    if (newTabs.length === 0) {
      return console.log("[tabs handler] no need to update tabs")
    }

    console.log(
      "[tabs handler] Tabs data:\n",
      "| tabs:", newTabs, "\n",
      "| first tab:", newTabs[0], "\n"
    )
     
    console.assert(
      tabs().every(it => 'id' in it),
      "[tabs handler] One or more tabs data is/are missing the \"id\" prop."
    )

    setTabs(newTabs)
    setCurrentFocusedTab(newTabs[0].id)
    console.log("[tabs handler] tabs updated")
  }

  setNewTabs(initialTabData ?? [])

  return {
    on$: tabEvent.on$,
    getCurrentFocused$() {
      const [tabData] = arrayObjects(tabs()).find$(it => it.id === focusedTabId())
      return tabData
    },
    create$(data: T) {
      console.assert(
        'id' in data,
        "[tabs handler] Tab data missing \"id\" prop."
      )
      setTabs(prev => [...prev, data])
      tabEvent.emit$(TabEvent.CREATE, data)
      console.log("[tabs handler] new tab created:", data)
    },
    update$: updateTab,
    setDisable$: setDisabledTab,
    delete$(tabId: string) {
      setTabs(prev => [...arrayObjects(prev).remove$('id', tabId)])
    },
    set$: setNewTabs,
    get$: tabs,
    TabList$: (props: { tabComponent$: VoidComponent<T> }) => (
      <section
        {...stylex.attrs(style.tabList)}
        use:dndzone={{
          items: tabs,
          type: crypto.randomUUID(),
          dragDisabled: disabledTab(),
          dropTargetStyle: {
            outline: 'none'
          }
        }}
        on:consider={considerDragging}
        on:finalize={finalizeDragging}
        data-tab-list=""
      >
        <For each={tabs()}>
          {it => (
            <button
              {...stylex.attrs(style.tabItem)}
              onClick={() => onClickingTab(it.id)}
              disabled={disabledTab()}
              data-tab-item-focused={it.id === focusedTabId()}
            >
              <props.tabComponent$ {...it} />
            </button>
          )}
        </For>
      </section>
    ),
    TabContent$: (props: { tabComponent$: VoidComponent<ITabComponentProps> }) => (
      <Show when={focusedTabId() !== ''}>
        <props.tabComponent$ tabId$={focusedTabId()} />
      </Show>
    )
  }
}

export type TabsHandler<T extends BaseTabData> = ReturnType<typeof createTabs<T>>