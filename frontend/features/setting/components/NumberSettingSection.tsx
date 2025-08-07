import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"
import { RootSettingDescription, RootSettingInput, RootSettingName, RootSettingSection, sectionStyle } from "./RootSettingSection"
import { ISettingSectionProps, SettingSectionOptions } from "../types"
import { Input, Spacer } from "~/components"

const style = stylex.create({
  section: {
    flexFlow: "column",
  }
})

interface INumberSettingSectionProps extends ISettingSectionProps<number> {
}

export function NumberSettingSection(props: INumberSettingSectionProps) {
  return (
    <RootSettingSection {...stylex.attrs(style.section, shorthands.flex$)}>
      <RootSettingName {...props} inline$={
        <>
          <Spacer />
          <RootSettingInput 
            type="number"
            disabled={props.disabled$} 
            onInput={(inputEvent) => props.onChange$(parseInt(inputEvent.currentTarget.value))} 
          />
        </>
      } />
      <RootSettingDescription {...props} />
    </RootSettingSection >
  )
}