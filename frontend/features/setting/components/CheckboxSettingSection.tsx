import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
// ...
import { Checkbox, Spacer } from "~/components"
// ...
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps, SettingSectionOptions } from "../types"

const style = stylex.create({
  section: {
    flexFlow: "column",
  }
})

interface ICheckboxSettingSectionProps extends ISettingSectionProps<boolean> {
  options$?: SettingSectionOptions
}

export function CheckboxSettingSection(props: ICheckboxSettingSectionProps) {
  return (
    <RootSettingSection {...stylex.attrs(style.section, shorthands.flex$)}>
      <RootSettingName {...props} inline$={
        <>
          <Spacer />
          <Checkbox
            {...props.options$}
            disabled={props.disabled$}
            onChange={props.onChange$}
          />
        </>
      } />
      <RootSettingDescription {...props} />
    </RootSettingSection>
  )
}