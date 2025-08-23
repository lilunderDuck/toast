import { Match, type ParentProps, Show, Switch } from "solid-js"
// ...
import { Checkbox, Input, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import { shorthands } from "~/styles/shorthands"

const style = stylex.create({
  thisThing: {
    marginTop: 10,
    ":first-child": {
      marginTop: 0
    }
  },
  section: {
    flexFlow: "column",
  },
  description: {
    fontSize: 14,
    color: "var(--gray11)",
    paddingRight: "2rem"
  },
  disabled_name: {
    color: "var(--gray10)",
  },
  disabled_description: {
    color: "var(--gray9)",
  },
  input: {
    width: '8rem',
    paddingBlock: 5
  },
  inputRange: {
    flexFlow: "column",
    width: "100%",
    flexShrink: 0
  }
})

type SettingTypeMapping = {
  [SettingType.CHECKBOX]: boolean
  [SettingType.INPUT]: any
  [SettingType.CUSTOM]: any
  [SettingType.RANGE]: any
}

type SettingOptionsMapping = {
  [SettingType.INPUT]: Pick<HTMLAttributes<"input">, "min" | "max" | "step" | "type">
  [SettingType.CHECKBOX]: any
  [SettingType.CUSTOM]: any
  [SettingType.RANGE]: Pick<HTMLAttributes<"input">, "min" | "max" | "step" | "type">
}

interface ISettingSectionProps<T extends SettingType> {
  name$: string
  description$?: string
  disabled$?: boolean
  options$?: SettingOptionsMapping[T]
  type$: SettingType
  onChange$?: (data: SettingTypeMapping[T]) => any
}

export function SettingSection<T extends SettingType>(props: ParentProps<ISettingSectionProps<T>>) {
  return (
    <section {...stylex.attrs(style.thisThing)}>
      <div {...stylex.attrs(style.section, shorthands.flex$)}>
        <div {...stylex.attrs(
          props.type$ === SettingType.RANGE ? style.inputRange : shorthands.flex_y_center$,
          props.type$ === SettingType.RANGE ? shorthands.flex$ : {}
        )}>
          <h4 {...stylex.attrs(
            props.disabled$ ? style.disabled_name : {},
          )}>
            {props.name$}
          </h4>
          <Spacer />
          <Switch>
            <Match when={props.type$ === SettingType.CHECKBOX}>
              <Checkbox 
                disabled={props.disabled$} 
                onChange={props.onChange$} 
              />
            </Match>
            <Match when={
              props.type$ === SettingType.INPUT ||
              props.type$ === SettingType.RANGE
            }>
              <Input 
                {...props.options$}
                {...stylex.attrs(style.input)}
                disabled={props.disabled$} 
                onInput={(e) => (props as ISettingSectionProps<SettingType.INPUT>).onChange$?.(parseInt(e.currentTarget.value))} 
              />
            </Match>
          </Switch>
        </div>
        <Show when={props.description$}>
          <p {...stylex.attrs(style.description, props.disabled$ ? style.disabled_description : {})}>
            {props.description$}
          </p>
        </Show>
      </div>
      {props.children}
    </section>
  )
}