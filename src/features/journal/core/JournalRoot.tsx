import { useNavigate, useParams } from '@solidjs/router'
import { onCleanup, onMount, type ParentProps } from 'solid-js'
// ...
import { bodyClasslist } from '~/utils'
import { Resizable } from '~/components'
import { ThisEditorProvider } from '~/features/editor'
import type { IJournalGroupData} from '~/api/journal'
import { toast } from '~/features/toast'
import { api_getGroup } from '~/features/home'
// ...
import __style from './stuff.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { JournalProvider, useJournalContext } from '../context'
import { api_getJournalVirturalFileTree, type TreeNode } from '../utils'

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

  /**Well, the function name tell you exactly what this does.
   * 
   * ...and also show a toast message too.
   * @returns *nothing*
   */
  const goHomeImmediately = () => {
    console.error(`[complete panic] Failed to get some data from ${param.id}. You're now going back to home page...`)
    toast.error('Failed to open that journal group. It may be deleted or corrupted.')
    return goHome()
  }

  /**This is a dummy component only to initialize everything it needs.
   * 
   * This is because it needs to access the `useJournalContext()` so it can set and mess it up.
   * @returns `JSX.Element`, but nothing render anything
   */
  const LoadThing = () => {
    const { $journal, $fileDisplay, $sessionStorage } = useJournalContext()

    onMount(async() => {
      const currentGroupId = param.id
      console.log('Starting up:', currentGroupId)
      // Attempt to get the journal group data from the server
      const data = await api_getGroup(currentGroupId) as IJournalGroupData
      if (!data) {
        return goHomeImmediately()
      }

      const treeData = await api_getJournalVirturalFileTree(currentGroupId)

      console.log('Tree data is', treeData, treeData.lookup)

      // note: you should not reorder this line of code here, otherwise it *will* break
      $journal.cache$ = new Map(Object.entries(treeData.lookup))
      
      // @ts-ignore - should work
      delete data.tree
      $sessionStorage.$set('currentGroup', data)
      
      $fileDisplay.setTree(treeData.tree as TreeNode[])

      console.log('\n\n\n\n\n\n\n\n\n\n\n... A bunch of empty lines to make the log message not so messy ...\n\n\n\n\n\n\n\n\n\n\n\n\n')
    })

    return (
      <></>
    )
  }
 
  return (
    <ThisEditorProvider>
      <JournalProvider>
        <LoadThing />
        <Resizable {...stylex.attrs(style.thisThing)}>
          {props.children}
        </Resizable>
      </JournalProvider>
    </ThisEditorProvider>
  )
}