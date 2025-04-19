import { createResource, For, Show } from "solid-js"
// ...
import type { IJournalGroupData } from "~/api/journal"
import { Flex, FlexCenter } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import { CreateJournalGroupButton, JournalGrid } from "../components"
import { useJournalHomeContext } from '../provider'
// ...
import stylex from "@stylexjs/stylex"
import __style from '../components/journal-grid/JournalGrid.module.css'

const style = stylex.create({
  journalList: {
    gap: 15,
    flexWrap: 'wrap'
  },
  loadingJournalList: {
    width: '100%',
    height: '8rem',
    backgroundColor: 'var(--gray2)'
  }
})

type OnClickingJournalGroup = (data: IJournalGroupData) => EventHandler<"div", "onClick">

export function JournalList() {
  const { grid$, event$, infoSidebar$ } = useJournalHomeContext()

  const [resource] = createResource(async() => {
    await grid$.fetch$()
    return true
  })

  let lastElement: HTMLDivElement | undefined
  const clickOnSomeJournalGroup: OnClickingJournalGroup = (data) => (mouseEvent) => {
    highlightJournalGroup(mouseEvent.currentTarget)
    infoSidebar$.open$(data)
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

  event$.on$('home__infoSidebarClose$', () => {
    deselectLastHighlightedGroupIfCan()
    lastElement = undefined
  })

  return (
    <Flex class={mergeClassname(
      stylex.attrs(style.journalList),
      __style['journal-list']
    )}>
      <Show when={!resource.loading} fallback={
        <FlexCenter {...stylex.attrs(style.loadingJournalList)}>
          Spinnin'
        </FlexCenter>
      }>
        <For each={grid$.groups$()}>
          {it => (
            <JournalGrid {...it} onClick={clickOnSomeJournalGroup(it)}/>
          )}
        </For>
        <CreateJournalGroupButton />
      </Show>
    </Flex>
  )
}