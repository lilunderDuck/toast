import { onCleanup, ParentProps } from 'solid-js'
// ...
import { bodyClasslist } from '~/utils'
import { Resizable } from '~/components'
import { ThisEditorProvider } from '~/features/editor'
// ...
import __style from './stuff.module.css'
import stylex from '@stylexjs/stylex'
// ...
import { JournalProvider } from '../context'
import { TabProvider } from '../components'

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
 
  return (
    <TabProvider>
      <ThisEditorProvider>
        <JournalProvider>
          <Resizable {...stylex.attrs(style.thisThing)}>
            {props.children}
          </Resizable>
        </JournalProvider>
      </ThisEditorProvider>
    </TabProvider>
  )
}