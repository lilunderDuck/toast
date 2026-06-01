import { type ParentProps } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps } from "../provider"

interface ICustomSettingSectionProps extends ISettingSectionProps<number> {
  // ...
}

const section = css`
  display: flex;
  flex-flow: column;
  padding-bottom: 10px;
`

export function CustomSettingSection(props: ParentProps<ICustomSettingSectionProps>) {
  return (
    <RootSettingSection>
      <div class={section}>
        <RootSettingName {...props} />
        <RootSettingDescription {...props} />
      </div>
      {props.children}
    </RootSettingSection>
  )
}