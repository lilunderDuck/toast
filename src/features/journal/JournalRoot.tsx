import { bodyClasslist } from '~/utils'
import __style from './stuff.module.css'
import { onCleanup, ParentProps } from 'solid-js'
import { JournalProvider } from './context'
import { Resizable } from '~/components'
import stylex from '@stylexjs/stylex'

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
    <JournalProvider>
      <Resizable {...stylex.attrs(style.thisThing)}>
        {props.children}
      </Resizable>
    </JournalProvider>
  )
}