import type { ParentProps } from 'solid-js'
// ...
import { Toaster } from '~/libs/solid-toast'
import { AppTitleBarButton } from './components'

export default function App(props: ParentProps) {
  return (
    <>
      <Toaster />
      <AppTitleBarButton />
      {props.children}
    </>
  )
}