import type { ParentProps } from 'solid-js'
// ...
import { AppTitleBarProvider } from '~/components'
import { Toaster } from '~/libs/solid-toast'

export default function App(props: ParentProps) {
  return (
    <AppTitleBarProvider>
      <Toaster />
      {props.children}
    </AppTitleBarProvider>
  )
}