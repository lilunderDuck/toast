import { createSignal, For, Show, type VoidComponent } from "solid-js"
// @ts-ignore - used as a directive
import { dndzone } from "solid-dnd-directive"
// ...
import { css } from "molcss"
// ...
import { arrayObjects, createEvent, type EventHandler, type IEvent } from "~/utils"
import { DEBUG_INFO_LABEL } from "macro-def"

const tabList = css`
  display: flex;
  align-items: center;
  gap: 5px;
  outline: none;
`

const tabItem = css`
  outline: none;
  cursor: pointer;
`

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
    DEBUG_INFO_LABEL("[tabs handler]", 'focused tab:', tabData)
  }

  const updateTab = (tabId: number | string, newData: Partial<T>) => {
    setTabs(prev => [...arrayObjects(prev).replace$(it => it.id === tabId, newData)])
    tabEvent.emit$(TabEvent.UPDATE, tabs())
    DEBUG_INFO_LABEL("[tabs handler]", "updated tab id:", tabId, newData)
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
      return DEBUG_INFO_LABEL("[tabs handler]", "already opened tab", tabId)
    }

    setCurrentFocusedTab(tabId)
    DEBUG_INFO_LABEL("[tabs handler]", "click", tabId)
  }

  const setNewTabs = (newTabs: T[]) => {
    if (newTabs.length === 0) {
      return DEBUG_INFO_LABEL("[tabs handler]", "no need to update tabs")
    }

    DEBUG_INFO_LABEL("[tabs handler]", "tabs data:\n",
      "| tabs:", newTabs, "\n",
      "| first tab:", newTabs[0], "\n"
    )
     
    console.assert(
      tabs().every(it => 'id' in it),
      "[tabs handler] One or more tabs data is/are missing the \"id\" prop."
    )

    setTabs(newTabs)
    setCurrentFocusedTab(newTabs[0].id)
    DEBUG_INFO_LABEL("[tabs handler]", "tabs updated")
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
      DEBUG_INFO_LABEL("[tabs handler]", "new tab created:", data)
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
        class={tabList}
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
              class={tabItem}
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