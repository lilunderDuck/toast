import "./SplashScreen.css"
// ...
import { Match, Switch } from "solid-js"
import DefaultSplashScreen from "../variant/default"
import NeoforgeSplashScreen from "../variant/mc_neoforge"
import { usePersistedSignal } from "~/hooks"

export function SplashScreen() {
  const [variant] = usePersistedSignal(localStorage, 'splash_variant', SplashScreenVariant.DEFAULT)

  return (
    <Switch fallback={<DefaultSplashScreen />}>
      <Match when={variant() === SplashScreenVariant.DEFAULT}>
        <DefaultSplashScreen />
      </Match>

      <Match when={variant() === SplashScreenVariant.MC_NEOFORGE}>
        <NeoforgeSplashScreen />
      </Match>
    </Switch>
  )
}