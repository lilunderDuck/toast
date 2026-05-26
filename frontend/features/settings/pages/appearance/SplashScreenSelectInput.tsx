import type { Accessor, JSX, Setter } from "solid-js"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components"

import stylex from "@stylexjs/stylex"

const style = stylex.create({
  splashScreenInput__description: {
    fontSize: 14,
    color: "var(--subtext0)"
  }
})

export const SPLASH_NAME_MAPPING: Record<SplashScreenVariant, {
  name$: string
  description$: JSX.Element
}> = {
  [SplashScreenVariant.DEFAULT]: {
    name$: "Default splash screen",
    description$: "The default Toast splash screen."
  },
  [SplashScreenVariant.MC_NEOFORGE]: {
    name$: "NeoForge early loading screen",
    description$: <>The red background screen that <a href="https://neoforged.net/">NeoForge</a> showes when it starts to load some mods.</>
  }
}

interface ISplashScreenSelectInputProps {
  value$: Accessor<SplashScreenVariant>
  onChange$: Setter<SplashScreenVariant>
}

export function SplashScreenSelectInput(props: ISplashScreenSelectInputProps) {
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
          <span>{SPLASH_NAME_MAPPING[props.item.rawValue].name$}</span>
          <p {...stylex.attrs(style.splashScreenInput__description)}>
            {SPLASH_NAME_MAPPING[props.item.rawValue].description$}
          </p>
        </SelectItem>
      )}
      defaultValue={SplashScreenVariant.DEFAULT}
    >
      <SelectTrigger>
        <SelectValue<SplashScreenVariant>>
          {(state) => SPLASH_NAME_MAPPING[state.selectedOption()].name$}
        </SelectValue>
      </SelectTrigger>
      <SelectContent />
    </Select>
  )
}