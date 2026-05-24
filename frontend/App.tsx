import { type ParentProps } from 'solid-js'
// ...
import { Toaster } from '~/libs/solid-toast'
import { AppTitleBarButton } from '~/components'
// ...
import { SplashScreen, SplashScreenProvider } from './libs/splash-screen'

export default function App(props: ParentProps) {
  return (
    <>
      <SplashScreenProvider>
        <SplashScreen />
      </SplashScreenProvider>
      <Toaster />
      <AppTitleBarButton />
      {props.children}
    </>
  )
}