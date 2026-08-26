import { type ParentProps } from 'solid-js'
// ...
import { Toaster, AppTitleBarButton } from '~/components'
import { GlobalProvider } from '~/features/home'
// ...
import { Portal } from 'solid-js/web'

export default function App(props: ParentProps) {
  return (
    <>
      <Toaster />
      <Portal>
        <AppTitleBarButton />
      </Portal>
      <GlobalProvider>
        {props.children}
      </GlobalProvider>
    </>
  )
}