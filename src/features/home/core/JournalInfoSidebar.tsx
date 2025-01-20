import { Show } from "solid-js"
import { useNavigate } from "@solidjs/router"
// ...
import { OpenAndCloseButton } from "~/components"
import { mergeClassname } from "~/utils"
// ...
import stylex from "@stylexjs/stylex"
import __style from './JournalInfoSidebar.module.css' 
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { BackgroundShowcase, InfoList } from "../components"
import { useJournalHomeContext } from "../provider"

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
  on$lyOnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 10,
    gap: 10
  }
})

export function JournalInfoSidebar() {
  const navigateTo = useNavigate()
  const { infoSidebar$ } = useJournalHomeContext()
  const redirectToJournalPage = () => navigateTo(`/journal/${infoSidebar$.currentJournalData$()?.id}`)

  return (
    <Show when={infoSidebar$.currentJournalData$()}>
      <div 
        class={mergeClassname(
          __scrollbarStyle.scrollbar,
          __scrollbarStyle.scrollbarVertical,
          __scrollbarStyle.invsScrollbar,
          stylex.attrs(style.$sidebar)
        )}
        id={__style.sidebar}
      >
        <BackgroundShowcase 
          $heading={infoSidebar$.currentJournalData$()?.name}
          $sectionText={infoSidebar$.currentJournalData$()?.description}
        />
        <InfoList {...infoSidebar$.currentJournalData$()!} />
        <OpenAndCloseButton 
          onClickingClose$={infoSidebar$.close$}
          onClickingOpen$={redirectToJournalPage}
          openText$='Open this'
          closeText$='Close'
        />
      </div>
    </Show>
  )
}