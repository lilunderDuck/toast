import { type ParentProps } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import { type ISettingSectionProps } from "../types"

interface ICustomSettingSectionProps extends ISettingSectionProps<number> {
  // ...
}

const style = stylex.create({
  section: {
    display: "flex",
    flexFlow: "column",
  }
})

export function CustomSettingSection(props: ParentProps<ICustomSettingSectionProps>) {
  return (
    <RootSettingSection>
      <div {...stylex.attrs(style.section)}>
        <RootSettingName {...props} />
        <RootSettingDescription {...props} />
      </div>
      {props.children}
    </RootSettingSection>
  )
}