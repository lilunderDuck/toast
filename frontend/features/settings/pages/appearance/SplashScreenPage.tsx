import { For, lazy, Match, Show, Switch } from "solid-js"
import { BsInfoCircleFill } from "solid-icons/bs"
// ...
import { CustomSettingSection } from "../../components"
import { SplashScreenSelectInput } from "./SplashScreenSelectInput"
// ...
import { css } from "molcss"
import "./SplashScreenPage.css"
// ...
import { usePersistedSignal } from "~/hooks"

const screen__splashNoteWrap = css`
  margin-block: 15px;
  padding-block: 10px;
  padding-inline: 15px;
  border-radius: 6px;
  background-color: var(--surface0);
`

const screen__previewNoSplash = css`
  background-color: var(--surface0);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 5rem;
  border-radius: 6px;
`

export function SplashScreenPage() {
  const [variant, setVariant] = usePersistedSignal(localStorage, 'splash_variant', SplashScreenVariant.DEFAULT)

  const DefaultSplashScreen = lazy(() => import("~/features/splash/preview/DefaultSplashScreenPreview"))
  const NeoforgeSplashScreen = lazy(() => import("~/features/splash/preview/NeoforgeSplashScreenPreview"))

  const SPLASH_SCREEN_NOTES_REGISTRY: Partial<Record<SplashScreenVariant, string>> = {
    [SplashScreenVariant.MC_NEOFORGE]: "You will have to wait for a few seconds longer. If you're fine with it, go for it :)",
  }

  const getSplashScreenNote = () => SPLASH_SCREEN_NOTES_REGISTRY[variant()]

  return (
    <>
      <CustomSettingSection
        name$="Variant"
        description$="Yep, you can change the splash screen. Revolutionary."
      >
        <SplashScreenSelectInput
          onChange$={setVariant}
          value$={variant}
        />
      </CustomSettingSection>

      <Show when={getSplashScreenNote()}>
        <div class={screen__splashNoteWrap}>
          <b class={css`display: flex; align-items: center; gap: 10px;`}>
            <BsInfoCircleFill />
            Notes:
          </b>
          <p>
            {SPLASH_SCREEN_NOTES_REGISTRY[variant()]}
          </p>
        </div>
      </Show>

      <h4 class={css`margin-block: 10px;`}>Preview</h4>

      <Switch fallback={
        <div class={screen__previewNoSplash}>
          Seems like there's nothing here, try selecting the splash variant so I can show it to you... 
        </div>
      }>
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