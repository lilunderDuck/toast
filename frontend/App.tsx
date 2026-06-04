import { type ParentProps } from 'solid-js'
// ...
import { Toaster, AppTitleBarButton } from '~/components'
// ...
import { SplashScreen, SplashScreenProvider } from './features/splash'
import { SettingProvider } from './features/settings'

export default function App(props: ParentProps) {
  return (
    <SettingProvider>
      <SplashScreenProvider>
        <SplashScreen />
      </SplashScreenProvider>
      <Toaster />
      <AppTitleBarButton />
      {props.children}
    </SettingProvider>
  )
}