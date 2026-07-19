import type { Accessor, JSX, Setter } from "solid-js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"

import { css } from "molcss"

const splashScreenInput__description = css`
  font-size: 14px;
  color: var(--subtext0);
`

interface ISplashScreenSelectInputProps {
  value$: Accessor<SplashScreenVariant>
  onChange$: Setter<SplashScreenVariant>
}

export function SplashScreenSelectInput(props: ISplashScreenSelectInputProps) {
  const SPLASH_NAME_REGISTRY: Record<SplashScreenVariant, {
    name$: string
    description$: JSX.Element
  }> = {
    [SplashScreenVariant.DEFAULT]: {
      name$: "Default splash screen",
      description$: "The default Toast splash screen."
    },
    [SplashScreenVariant.MC_NEOFORGE]: {
      name$: "(Neo)Forge-like early loading screen",
      description$: "The red screen that (Neo)Forge shows when it starts to load some mods."
    }
  }

  return (
    <Select 
      value={props.value$()}
      onChange={props.onChange$}
      options={[
        SplashScreenVariant.DEFAULT,
        SplashScreenVariant.MC_NEOFORGE,
      ]}
      placeholder="Select a variant"
      itemComponent={(props) => (
        <SelectItem item={props.item}>
          <span>{SPLASH_NAME_REGISTRY[props.item.rawValue].name$}</span>
          <p class={splashScreenInput__description}>
            {SPLASH_NAME_REGISTRY[props.item.rawValue].description$}
          </p>
        </SelectItem>
      )}
      defaultValue={SplashScreenVariant.DEFAULT}
    >
      <SelectTrigger>
        <SelectValue<SplashScreenVariant>>
          {(state) => SPLASH_NAME_REGISTRY[state.selectedOption()].name$}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}