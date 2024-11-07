import { createSignal, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
// ...
import type { JournalGroupData } from "~/api"
import { OpenAndCloseButton } from "../../../../components"
// ...
import stylex from "@stylexjs/stylex"
import __style from './sidebar.module.css' 
// ...
import BackgroundShowcase from "./BackgroundShowcase"
import InfoList from "./InfoList"

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

const [currentJournalData, setCurrentJournalData] = createSignal<JournalGroupData>()

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

export function openJournalInfoSidebar(data: JournalGroupData) {
  setCurrentJournalData(data)
  console.log('[home > sidebar] opened', data)
}

export function closeJournalInfoSidebar() {
  setCurrentJournalData(undefined)
  console.log('[home > sidebar] closed')
  JournalInfoSidebar.$onClose()
}

export function updateJournalInfoSidebar(data: JournalGroupData) {
  // looks confusing at first, but openJournalInfoSidebar() basically is just update the 
  // currentJournalData signal.
  // 
  // also, if you setCurrentJournalData() to something that NOT undefined,
  // the info sidebar will be shown.
  if (currentJournalData()) {
    openJournalInfoSidebar(data)
  }
}