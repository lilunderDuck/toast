import stylex from "@stylexjs/stylex"
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import { shorthands } from "~/styles/shorthands"
import { ISettingSectionProps } from "../types"
import { ParentProps } from "solid-js"

interface ICustomSettingSectionProps extends ISettingSectionProps<number> {
  // ...
}

const style = stylex.create({
  section: {
    flexFlow: "column",
  }
})

export function CustomSettingSection(props: ParentProps<ICustomSettingSectionProps>) {
  return (
    <RootSettingSection>
      <div {...stylex.attrs(style.section, shorthands.flex$)}>
        <RootSettingName {...props} />
        <RootSettingDescription {...props} />
      </div>
      {props.children}
    </RootSettingSection>
  )
}