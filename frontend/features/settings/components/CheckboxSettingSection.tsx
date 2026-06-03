import { css } from "molcss"
// ...
import { Checkbox, Spacer } from "~/components"
// ...
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps, SettingSectionOptions } from "../provider"

const section = css`
  display: flex;
  flex-flow: column;
`

interface ICheckboxSettingSectionProps extends ISettingSectionProps<boolean> {
  options$?: SettingSectionOptions
}

export function CheckboxSettingSection(props: ICheckboxSettingSectionProps) {
  return (
    <RootSettingSection class={section}>
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