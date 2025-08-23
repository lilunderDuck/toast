import { For } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input, Spacer } from "~/components"
import { shorthands } from "~/styles/shorthands"
import { RootSettingDescription, RootSettingName, RootSettingSection } from "./RootSettingSection"
import type { ISettingSectionProps, SettingSectionOptions } from "../types"

const style = stylex.create({
  section: {
    flexFlow: "column",
  },
  input: {
    paddingInline: "0 !important"
  },
  dataList: {
    justifyContent: "space-between",
    fontSize: 11,
    marginBottom: 5,
    color: "var(--gray11)"
  }
})

interface IRangeSettingSectionProps extends ISettingSectionProps<number> {
  options$?: SettingSectionOptions
  markerValue$: { name$: string, value$: number }[]
}

export function RangeSettingSection(props: IRangeSettingSectionProps) {
  const markerName = crypto.randomUUID()

  return (
    <RootSettingSection {...stylex.attrs(style.section, shorthands.flex$)}>
      <RootSettingName {...props} />
      <Spacer />
      <Input
        {...props.options$}
        {...stylex.attrs(style.input)}
        type="range"
        disabled={props.disabled$} 
        list={markerName}
        onInput={(e) => props.onChange$?.(parseInt(e.currentTarget.value))} 
      />
      <datalist id={markerName} {...stylex.attrs(style.dataList, shorthands.flex$)}>
        <For each={props.markerValue$}>
          {it => (
            <option value={it.value$} label={it.name$} />
          )}
        </For>
      </datalist>
      <RootSettingDescription {...props} />
    </RootSettingSection >
  )
}