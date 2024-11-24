import { createResource, createSignal, For, Show } from "solid-js"
// ...
import { 
  JOURNAL_GROUP_ROUTE, 
  type JournalGroupData 
} from "~/api"
import { Flex, FlexCenter } from "~/components"
import { fetchIt, mergeClassname } from "~/utils"
import { thisArrayObjects } from "~/common"
// ...
import { JournalInfoSidebar, openJournalInfoSidebar } from "./sidebar"
import { CreateNewJournalGroup, JournalGrid } from "./journal-grid"
// ...
import stylex from "@stylexjs/stylex"
import __style from './JournalList.module.css'

const style = stylex.create({
  $journalList: {
    gap: 15,
    flexWrap: 'wrap'
  },
  loadingJournalList: {
    width: '100%',
    height: '8rem',
    backgroundColor: 'var(--gray2)'
  }
})

type OnClickingJournalGroup = (data: JournalGroupData) => EventHandler<"div", "onClick">

const [journalGroups, setJournalGroups] = createSignal<JournalGroupData[]>([])
export function JournalList() {
  const [resource] = createResource(async() => {
    const data = await fetchIt<JournalGroupData[]>('GET', JOURNAL_GROUP_ROUTE) ?? []
    setJournalGroups(data)
    return true
  })

  let lastElement: HTMLDivElement | undefined
  const clickOnSomeJournalGroup: OnClickingJournalGroup = (data) => (mouseEvent) => {
    highlightJournalGroup(mouseEvent.currentTarget)
    openJournalInfoSidebar(data)
  }
  
  const highlightJournalGroup = (someElement: HTMLDivElement) => {
    deselectLastHighlightedGroupIfCan()

    someElement.classList.add(__style.active)
    lastElement = someElement
  }

  const deselectLastHighlightedGroupIfCan = () => {
    if (lastElement) {
      lastElement.classList.remove(__style.active)
    }
  }

  JournalInfoSidebar.$onClose = () => {
    deselectLastHighlightedGroupIfCan()
    lastElement = undefined
  }

  return (
    <Flex class={mergeClassname(
      stylex.attrs(style.$journalList),
      __style['journal-list']
    )}>
      <Show when={!resource.loading} fallback={
        <FlexCenter {...stylex.attrs(style.loadingJournalList)}>
          Spinnin'
        </FlexCenter>
      }>
        <For each={journalGroups()}>
          {it => (
            <JournalGrid {...it} $onClick={clickOnSomeJournalGroup(it)}/>
          )}
        </For>
        <CreateNewJournalGroup />
      </Show>
    </Flex>
  )
}

export function addJournalList(another: JournalGroupData) {
  setJournalGroups(prev => [...prev, another])
}

export function updateJournalList(newOne: JournalGroupData) {
  setJournalGroups(prev => [...thisArrayObjects(prev).$replace(it => it.id === newOne.id, newOne)])
}