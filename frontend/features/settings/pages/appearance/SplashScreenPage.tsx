import { For, lazy, Match, Switch } from "solid-js";
import { CustomSettingSection } from "../../components";
import "./SplashScreenPage.css"
import { SplashScreenSelectInput } from "./SplashScreenSelectInput";
import { usePersistedSignal } from "~/hooks";

const DefaultSplashScreen = lazy(() => import("~/features/splash/variant/default/DefaultSplashScreenPreview"))
const NeoforgeSplashScreen = lazy(() => import("~/features/splash/variant/mc_neoforge/NeoforgeSplashScreenPreview"))

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
              <SplashScreenComponent />
            </Match>
          )}
        </For>
      </Switch>
    </>
  )
}