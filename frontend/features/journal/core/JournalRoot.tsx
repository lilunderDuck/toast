import { useNavigate, useParams } from '@solidjs/router'
import { onCleanup, type ParentProps } from 'solid-js'
// ...
import { bodyClasslist } from '~/utils'
import { Resizable } from '~/components'
import { toast } from '~/features/toast'
import { EditorProvider } from '~/features/editor'
import { journalLog } from "~/features/debug"
// ...
import __style from './stuff.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { JournalProvider, JournalTabProvider } from '../context'
import { LoadThing } from '../components'
import { api_getJournal } from '~/api/journal'

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
    //debug-start
    journalLog.error(`Failed to get some data from ${param.id}. You're now going back to home page...`)
    //debug-end
    toast.error('Failed to open that journal group. It may be deleted or corrupted.')
    return goHome()
  }

  return (
    <EditorProvider>
      <JournalProvider>
        <LoadThing 
          currentGroupId$={param.id} 
          onError$={goHomeImmediately} 
        />
        <Resizable {...stylex.attrs(style.thisThing)}>
          <JournalTabProvider getDisplayName$={async(tabId) => {
            return (await api_getJournal(parseInt(param.id), tabId)).name
          }}>
            {props.children}
          </JournalTabProvider>
        </Resizable>
      </JournalProvider>
    </EditorProvider>
  )
}
