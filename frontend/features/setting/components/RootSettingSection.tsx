import { type JSX, Show } from "solid-js"
// ...
import stylex from "@stylexjs/stylex"
// ...
import { Input } from "~/components"
// ...
import { type ISettingSectionProps } from "../types"
import { MERGE_CLASS } from "macro-def"

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
    <h4 class={MERGE_CLASS(
      stylex.attrs(style.name),
      props.disabled$ ? stylex.attrs(style.name_disabled) : ''
    )}>
      {props.name$}
      {props.inline$}
    </h4>
  )
}

export function RootSettingDescription(props: Pick<ISettingSectionProps<any>, "description$" | "disabled$">) {
  return (
    <Show when={props.description$}>
      <p class={MERGE_CLASS(
        stylex.attrs(style.description),
        props.disabled$ ? stylex.attrs(style.description_disabled$) : ''
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
      class={MERGE_CLASS(
        props.type !== "range" ? stylex.attrs(style.input) : ''
      )}
    />
  )
}