import { For, lazy, Match, Switch } from "solid-js"
// ...
import { CustomSettingSection } from "../../components"
import { SplashScreenSelectInput } from "./SplashScreenSelectInput"
// ...
import "./SplashScreenPage.css"
// ...
import { usePersistedSignal } from "~/hooks"

const DefaultSplashScreen = lazy(() => import("~/features/splash/preview/DefaultSplashScreenPreview"))
const NeoforgeSplashScreen = lazy(() => import("~/features/splash/preview/NeoforgeSplashScreenPreview"))

export function SplashScreenPage() {
  const [variant, setVariant] = usePersistedSignal(localStorage, 'splash_variant', SplashScreenVariant.DEFAULT)

  return (
    <>
      <CustomSettingSection
        name$="Variant"
        description$="Yep, you can change the splash screen."
      >
        <SplashScreenSelectInput
          onChange$={setVariant}
          value$={variant}
        />
      </CustomSettingSection>
      <br />
      <Switch>
        <For each={[
          [SplashScreenVariant.DEFAULT, DefaultSplashScreen],
          [SplashScreenVariant.MC_NEOFORGE, NeoforgeSplashScreen]
        ]}>
          {([splashScreenId, SplashScreenComponent]) => (
            <Match when={variant() === splashScreenId}>
              {/* @ts-ignore */}
              <SplashScreenComponent />
            </Match>
          )}
        </For>
      </Switch>
    </>
  )
}