import stylex from "@stylexjs/stylex"
import { type ISettingSectionProps } from "../types"
import { type JSX, Show } from "solid-js"
import { Input } from "~/components"
import { shorthands } from "~/styles/shorthands"

export const sectionStyle = stylex.create({
  thisThing$: {
    marginTop: 15,
    ":first-child": {
      marginTop: 0
    }
  },
  name_disabled$: {
    color: "var(--gray10)"
  },
  description: {
    fontSize: 14,
    color: "var(--gray11)",
    paddingRight: "2rem"
  },
  description_disabled$: {
    color: "var(--gray9)"
  },
  input: {
    width: '8rem',
    paddingBlock: 5
  },
})

export function RootSettingSection(props: HTMLAttributes<"section">) {
  return (
    <section {...props} {...stylex.attrs(sectionStyle.thisThing$)} />
  )
}

export function RootSettingName(props: ISettingSectionProps<any> & {
  inline$?: JSX.Element
}) {
  return (
    <h4 {...stylex.attrs(props.disabled$ ? sectionStyle.name_disabled$ : {}, shorthands.flex_y_center$)}>
      {props.name$}
      {props.inline$}
    </h4>
  )
}

export function RootSettingDescription(props: Pick<ISettingSectionProps<any>, "description$" | "disabled$">) {
  return (
    <Show when={props.description$}>
      <p {...stylex.attrs(
        sectionStyle.description,
        props.disabled$ ? sectionStyle.description_disabled$ : {}
      )}>
        {props.description$}
      </p>
    </Show>
  )
}

export function RootSettingInput(props: HTMLAttributes<"input">) {
  return (
    <Input 
      {...props}
      {...stylex.attrs(props.type !== "range" ? sectionStyle.input : {})}
    />
  )
}