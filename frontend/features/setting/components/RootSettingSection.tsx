import { type JSX, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input } from "~/components"
// ...
import { type ISettingSectionProps } from "../types"

const style = stylex.create({
  thisThing$: {
    marginTop: 15,
    ":first-child": {
      marginTop: 0
    }
  },
  name: {
    display: "flex",
    alignItems: "center"
  },
  name_disabled: {
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
    <section {...props} {...stylex.attrs(style.thisThing$)} />
  )
}

export function RootSettingName(props: ISettingSectionProps<any> & {
  inline$?: JSX.Element
}) {
  return (
    <h4 {...stylex.attrs(props.disabled$ ? style.name_disabled : {}, style.name)}>
      {props.name$}
      {props.inline$}
    </h4>
  )
}

export function RootSettingDescription(props: Pick<ISettingSectionProps<any>, "description$" | "disabled$">) {
  return (
    <Show when={props.description$}>
      <p {...stylex.attrs(
        style.description,
        props.disabled$ ? style.description_disabled$ : {}
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
      {...stylex.attrs(props.type !== "range" ? style.input : {})}
    />
  )
}