import { splitProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
import __scrollbarStyle from '~/assets/style/scrollbar.module.css'
// ...
import { Divider } from "~/components"
import type { IJournalData } from "~/api/journal"
// ...
import { FileDisplay, useJournalContext } from "../../context"
import { SidebarButtonsRow } from "./SidebarButtonsRow"
import { Journal } from "./Journal"
import { JournalCategory } from "./JournalCategory"
import { mergeClassname } from "~/utils"

const style = stylex.create({
  sidebar: {
    width: '100%',
    paddingInline: 5,
    paddingTop: 5
  },
  content: {
    height: 'calc(100vh - (20px + 100px))'
  }
})

export interface ISidebarProps extends HTMLAttributes<"div"> {
  onClickingOpen$?: (journal: IJournalData) => void
  on$ClickingRemove?: (journal: IJournalData) => void
}

export function Sidebar(props: ISidebarProps) {
  const [, itsProps] = splitProps(props, ["onClickingOpen$", "on$ClickingRemove"])
  const { $journal, $fileDisplay } = useJournalContext()

  let lastJournalId: string | undefined
  $fileDisplay.setOptions({
    componentLookup: {
      // @ts-ignore
      file: Journal,
      // @ts-ignore
      folder: JournalCategory
    },
    dataLookup: $journal.cache$,
    onClick(type, id, data) {
      if (type !== 'file') return

      console.log(data)
      const thisJournalId = data.id 
      if (thisJournalId === lastJournalId) {
        return console.log(`No need to open journal, previous journal id: ${lastJournalId} - current journal id: ${thisJournalId}`)
      }
      
      props.onClickingOpen$?.(data)
      lastJournalId = thisJournalId
    },
  })

  return (
    <div 
      {...itsProps} 
      {...stylex.attrs(style.sidebar)} 
      editor-tour-sidebar
    >
      <SidebarButtonsRow />
      <Divider />
      <div class={mergeClassname(
        __scrollbarStyle.scrollbar,
        __scrollbarStyle.scrollbarVertical,
        __scrollbarStyle.invsScrollbar,
        stylex.attrs(style.content)
      )}>
        <FileDisplay />
      </div>
    </div>
  )
}