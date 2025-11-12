import { Show, type ParentProps } from 'solid-js'
// ...
import { Toaster } from '~/libs/solid-toast'
import { SplashScreen, SplashScreenProvider } from '~/features/splash-screen'
import { AppTitleBarButton } from '~/components'

export default function App(props: ParentProps) {
  return (
    <>
      <Show when={!isDevMode}>
        <SplashScreenProvider>
          <SplashScreen />
        </SplashScreenProvider>
      </Show>
      <Toaster />
      <AppTitleBarButton />
      {props.children}
    </>
  )
}