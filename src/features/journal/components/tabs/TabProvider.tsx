import {
  createContext,
  createSignal,
  type ParentProps,
  type Signal,
  useContext,
} from "solid-js"
import { thisArrayObjects } from "~/common"

type TabData = {
  name: "__NEW_TAB__" | string & {}
  id: string
  focused: boolean
}

interface ITabContext {
  $tabs: Signal<TabData[]>
  $setTab(tabId: string): void
  $addTab(name: string): TabData
  $updateTab(tabId: string, newName: string): void
  $getFocusedTab(): TabData
  $getSecondLastTab(): TabData | undefined
  $removeTab(tabId: string): void
}

const Context = createContext<ITabContext>()

export function TabProvider(props: ParentProps) {
  const createTabData = (name: TabData["name"]): TabData => {
    console.log('[tab] creating tab:', name)
    return {
      focused: true,
      id: crypto.randomUUID().slice(0, 5),
      name,
    }
  }

  const DEFAULT_TAB = createTabData("__NEW_TAB__")
  let currentTab: TabData = DEFAULT_TAB
  const [tabs, setTabs] = createSignal<TabData[]>([
    currentTab
  ])

  const updateSomeTab = (tabId: string, newThing: Partial<TabData>) => {
    setTabs((prev) => [
      ...thisArrayObjects(prev).$replace((it) => it.id === tabId, newThing),
    ])

    console.log('[tab] updated tab:', tabId)
  }

  const removeSomeTab = (tabId: string) => {
    console.assert(!findTabById(tabId), `Cannot find tab id: ${tabId}`)

    setTabs((prev) => [
      ...thisArrayObjects(prev).$remove('id', tabId),
    ])

    console.log('[tab] removed tab: ', tabId)
  }

  const addTabToTheRight = (newStuff: TabData) => {
    setTabs((prev) => [...prev, newStuff])

    console.log('[tab] added tab:', newStuff)
  }

  const findTabById = (tabId: string) => {
    const [thisTab] = thisArrayObjects(tabs()).$find((it) => it.id === tabId)
    if (!thisTab) {
      return console.warn("[tab] cannot find the tab with id", tabId)
    }

    return thisTab
  }

  return (
    <Context.Provider
      value={{
        $tabs: [tabs, setTabs],
        $setTab(tabId) {
          const thisTab = findTabById(tabId)
          if (!thisTab) return
          if (thisTab.id === tabId) return

          updateSomeTab(currentTab!.id, { focused: true })
        },
        $updateTab(tabId, newName) {
          const thisTab = findTabById(tabId)
          if (!thisTab) return

          updateSomeTab(currentTab!.id, { name: newName })
        },
        $addTab(name: string) {
          const newStuff = createTabData(name)

          if (currentTab.name === '__NEW_TAB__') {
            this.$updateTab(currentTab.id, name)
          }
          else {
            // unfocus the previous tab 
            updateSomeTab(currentTab!.id, { focused: false })
            addTabToTheRight(newStuff)
          }
          
          currentTab = newStuff
          return newStuff
        },
        $getFocusedTab() {
          return currentTab
        },
        $removeTab(tabId: string) {
          removeSomeTab(tabId)

          if (tabs().length === 0) {
            this.$addTab(DEFAULT_TAB.name)
          }
        },
        $getSecondLastTab() {
          return tabs().at(-2)
        },
      }}
    >
      {props.children}
    </Context.Provider>
  )
}

export const useTabContext = () => useContext(Context)!
