import { type ParentProps } from 'solid-js'
// ...
import { Toaster, AppTitleBarButton } from '~/components'
// ...
import { Portal } from 'solid-js/web'

export default function App(props: ParentProps) {
  return (
    <>
      <Toaster />
      <Portal>
        <AppTitleBarButton />
      </Portal>
      {props.children}
    </>
  )
}