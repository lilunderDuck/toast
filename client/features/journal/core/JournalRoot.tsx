import { useNavigate, useParams } from '@solidjs/router'
import { onCleanup, onMount, type ParentProps } from 'solid-js'
// ...
import { bodyClasslist } from '~/utils'
import { Resizable } from '~/components'
import { ThisEditorProvider } from '~/features/editor'
import { 
  type IJournalGroupData, 
  api_getGroup, 
  api_getJournalVirturalFileTree
} from '~/api/journal'
import { toast } from '~/features/toast'
// ...
import __style from './stuff.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { JournalProvider, useJournalContext } from '../context'

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
    const { fileDisplay$, sessionStorage$ } = useJournalContext()
    const currentGroupId = parseInt(param.id)
    const [, setIsLoading] = fileDisplay$.isLoading$

    onMount(async() => {
      // Attempt to get the journal group data from the server
      const data = await api_getGroup(currentGroupId) as IJournalGroupData
      if (!data) {
        return goHomeImmediately()
      }

      setIsLoading(true)
      // note: you should not reorder this line of code here, otherwise it *will* break
      const treeData = data.tree.data
      // @ts-ignore - should work
      delete data.tree
      sessionStorage$.set$('currentGroup', data)

      const treeMapping = await api_getJournalVirturalFileTree(currentGroupId)
      fileDisplay$.setTree$(treeData, treeMapping)
      setIsLoading(false)
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