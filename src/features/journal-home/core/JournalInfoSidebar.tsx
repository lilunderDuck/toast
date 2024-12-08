import { createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
// ...
import type { JournalApi } from "~/api/journal"
import { OpenAndCloseButton } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import __style from './JournalInfoSidebar.module.css' 
// ...
import { BackgroundShowcase, InfoList } from "../components"

const style = stylex.create({
  $sidebar: {
    width: '70%',
    height: '100%',
    backgroundColor: 'var(--gray2)',
    paddingBottom: 25,
    userSelect: 'none',
    position: 'relative'
  },
  $infoList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(40%, 1fr))',
    gap: 15
  },
  $onlyOnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
    gap: 10
  }
})

const [currentJournalData, setCurrentJournalData] = createSignal<JournalApi.GroupData>()

export function JournalInfoSidebar() {
  const navigateTo = useNavigate()
  const redirectToJournalPage = () => navigateTo(`/journal/${currentJournalData()?.id}`)

  return (
    <Show when={currentJournalData()}>
      <div 
        app-scrollbar 
        app-scrollbar-vertical 
        app-invs-scrollbar
        {...stylex.attrs(style.$sidebar)}
        id={__style.sidebar}
      >
        <BackgroundShowcase 
          $heading={currentJournalData()?.name}
          $sectionText={currentJournalData()?.description}
        />
        <InfoList {...currentJournalData()!} />
        <OpenAndCloseButton 
          $onClickingClose={() => {
            closeJournalInfoSidebar()
            JournalInfoSidebar.$onClose()
          }}
          $onClickingOpen={redirectToJournalPage}
          $openText='Open this'
          $closeText='Close'
        />
      </div>
    </Show>
  )
}

JournalInfoSidebar.$onClose = () => {}

export function openJournalInfoSidebar(data: JournalApi.GroupData) {
  setCurrentJournalData(data)
  console.log('[home > sidebar] opened', data)
}

export function closeJournalInfoSidebar() {
  setCurrentJournalData(undefined)
  console.log('[home > sidebar] closed')
  JournalInfoSidebar.$onClose()
}

export function updateJournalInfoSidebar(data: JournalApi.GroupData) {
  // looks confusing at first, but openJournalInfoSidebar() basically is just update the 
  // currentJournalData signal.
  // 
  // also, if you setCurrentJournalData() to something that NOT undefined,
  // the info sidebar will be shown.
  if (currentJournalData()) {
    openJournalInfoSidebar(data)
  }
}