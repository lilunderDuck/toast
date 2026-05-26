import { type JSX, Show } from "solid-js"
import { CLS } from "macro-def"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input } from "~/components"
import type { ISettingSectionProps } from "../provider"

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
    color: "var(--crust0)"
  },
  description: {
    fontSize: 14,
    color: "var(--subtext0)",
    paddingRight: "2rem",
    wordBreak: "break-all"
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
    <h4 class={`${CLS(style.name)} ${props.disabled$ ? CLS(style.name_disabled) : ''}`}>
      {props.name$}
      {props.inline$}
    </h4>
  )
}

export function RootSettingDescription(props: Pick<ISettingSectionProps<any>, "description$" | "disabled$">) {
  return (
    <Show when={props.description$}>
      <p class={`${CLS(style.description)} ${props.disabled$ ? CLS(style.description_disabled$) : ''}`}>
        {props.description$}
      </p>
    </Show>
  )
}

export function RootSettingInput(props: HTMLAttributes<"input">) {
  return (
    <Input 
      {...props}
      class={props.type !== "range" ? CLS(style.input) : ''}
    />
  )
}