import { useNavigate, useParams } from '@solidjs/router'
import { onCleanup, onMount, type ParentProps } from 'solid-js'
// ...
import { bodyClasslist, fetchIt } from '~/utils'
import { Resizable } from '~/components'
import { ThisEditorProvider } from '~/features/editor'
import { IClientJournalGroupData, JOURNAL_GROUP_ROUTE } from '~/api/journal'
import { toast } from '~/features/toast'
// ...
import __style from './stuff.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { TabProvider, JournalProvider, useJournalContext } from '../components'
import { setCurrentJournalGroupId } from '../utils'

const style = stylex.create({
  thisThing: {
    width: '100%',
    height: '100%'
  }
})

export function JournalRoot(props: ParentProps) {
  bodyClasslist().add(__style.journal)

  onCleanup(() => {
    bodyClasslist().remove(__style.journal)
  })

  const param = useParams()
  const goTo = useNavigate()
  const goHome = () => goTo('/')

  const LoadThing = () => {
    const { $journal, $fileDisplay } = useJournalContext()

    onMount(async() => {
      console.log('Starting up:', param.id)
      const data = await fetchIt<IClientJournalGroupData>('GET', `${JOURNAL_GROUP_ROUTE}?id=${param.id}`)
      if (!data) {
        return goHomeImmediately()
      }
      // note: you should not reorder this line of code here, otherwise it *will* break
      $journal.$setCurrentGroup(data)
      $journal.$cache = new Map(Object.entries(data.treeMapping))
      setCurrentJournalGroupId(data.id)
  
      $fileDisplay.setTree(data.tree)
    })

    return (<></>)
  }

  const goHomeImmediately = () => {
    console.error(`[complete panic] Failed to get some data from ${param.id}. You're now going back to home page...`)
    toast.error('Failed to open that journal group. It may be deleted or corrupted.')
    return goHome()
  }
 
  return (
    <TabProvider>
      <ThisEditorProvider>
        <JournalProvider>
          <LoadThing />
          <Resizable {...stylex.attrs(style.thisThing)}>
            {props.children}
          </Resizable>
        </JournalProvider>
      </ThisEditorProvider>
    </TabProvider>
  )
}