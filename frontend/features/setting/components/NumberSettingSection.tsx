import { Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { RootSettingDescription, RootSettingInput, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps } from "../types"

const style = stylex.create({
  section: {
    display: "flex",
    flexFlow: "column",
  }
})

interface INumberSettingSectionProps extends ISettingSectionProps<number> {
}

export function NumberSettingSection(props: INumberSettingSectionProps) {
  return (
    <RootSettingSection {...stylex.attrs(style.section)}>
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