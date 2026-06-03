import { Spacer } from "~/components"
// ...
import { css } from "molcss"
// ...
import { RootSettingDescription, RootSettingInput, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps } from "../provider"

const section = css`
  display: flex;
  flex-flow: column;
`

interface INumberSettingSectionProps extends ISettingSectionProps<number> {
}

export function NumberSettingSection(props: INumberSettingSectionProps) {
  return (
    <RootSettingSection class={section}>
      <RootSettingName {...props} inline$={
        <>
          <Spacer />
          <RootSettingInput 
            type="number"
            disabled={props.disabled$} 
            onInput={(inputEvent) => props.onChange$?.(parseInt(inputEvent.currentTarget.value))} 
          />
        </>
      } />
      <RootSettingDescription {...props} />
    </RootSettingSection >
  )
}