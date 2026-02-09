import { Match, type ParentProps, Show, Switch } from "solid-js"
// ...
import { Checkbox, Input, Spacer } from "~/components"
// ...
import stylex from "@stylexjs/stylex"
import { MERGE_CLASS } from "macro-def"

const style = stylex.create({
  section: {
    marginTop: 10,
    ":first-child": {
      marginTop: 0
    }
  },
  section__content: {
    display: "flex",
    flexFlow: "column",
  },
  description: {
    fontSize: 14,
    color: "var(--gray11)",
    paddingRight: "2rem"
  },
  section__disabledName: {
    color: "var(--gray10)",
  },
  section__disabledDescription: {
    color: "var(--gray9)",
  },
  section__input: {
    width: '8rem',
    paddingBlock: 5
  },
  seciton__inputRange: {
    display: "flex",
    flexFlow: "column",
    width: "100%",
    flexShrink: 0
  },
  seciton__inputEverythingElse: {
    display: "flex",
    alignItems: "center"
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
  const getInputStyle = () => MERGE_CLASS(
    props.type$ === SettingType.RANGE ? 
      stylex.attrs(style.seciton__inputRange) :
      stylex.attrs(style.seciton__inputEverythingElse)
    // 
  )

  const getNameStyle = () => MERGE_CLASS(
    props.disabled$ ? stylex.attrs(style.section__disabledName) : ''
  )

  return (
    <section {...stylex.attrs(style.section)}>
      <div {...stylex.attrs(style.section__content)}>
        <div class={getInputStyle()}>
          <h4 class={getNameStyle()}>
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
                {...stylex.attrs(style.section__input)}
                disabled={props.disabled$} 
                onInput={(e) => (props as ISettingSectionProps<SettingType.INPUT>).onChange$?.(parseInt(e.currentTarget.value))} 
              />
            </Match>
          </Switch>
        </div>
        <Show when={props.description$}>
          <p class={MERGE_CLASS(
            stylex.attrs(style.description),
            props.disabled$ ? stylex.attrs(style.section__disabledDescription) : ""
          )}>
            {props.description$}
          </p>
        </Show>
      </div>
      {props.children}
    </section>
  )
}