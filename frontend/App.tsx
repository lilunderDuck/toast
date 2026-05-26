import { type ParentProps } from 'solid-js'
// ...
import { Toaster } from '~/libs/solid-toast'
import { AppTitleBarButton } from '~/components'
// ...
import { SplashScreen, SplashScreenProvider } from './features/splash'
import { SettingProvider } from './features/settings'

export default function App(props: ParentProps) {
  return (
    <SettingProvider>
      <SplashScreenProvider>
        <SplashScreen variant$={SplashScreenVariant.DEFAULT} />
      </SplashScreenProvider>
      <Toaster />
      <AppTitleBarButton />
      {props.children}
    </SettingProvider>
  )
}