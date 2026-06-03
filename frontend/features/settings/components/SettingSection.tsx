import { Match, type ParentProps, Show, Switch } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Checkbox, Input, Spacer } from "~/components"
import type { HTMLAttributes } from "~/utils"

const section = css`
  margin-top: 10px;
  &:first-child {
    margin-top: 0px;
  }
`

const section__content = css`
  display: flex;
  flex-flow: column;
`

const description = css`
  font-size: 14px;
  color: var(--subtext0);
  padding-right: 2rem;
`

const section__disabledName = css`
  color: var(--crust0);
`

const section__disabledDescription = css`
  color: var(--gray9);
`

const section__input = css`
  width: 8rem;
  padding-block: 5px;
`

const seciton__inputRange = css`
  display: flex;
  flex-flow: column;
  width: 100%;
  flex-shrink: 0;
`

const seciton__inputEverythingElse = css`
  display: flex;
  align-items: center;
`

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
    <section class={section}>
      <div class={section__content}>
        <div class={props.type$ === SettingType.RANGE ? seciton__inputRange : seciton__inputEverythingElse}>
          <h4 class={props.disabled$ ? section__disabledName : ""}>
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
                class={section__input}
                disabled={props.disabled$} 
                onInput={(e) => (props as ISettingSectionProps<SettingType.INPUT>).onChange$?.(parseInt(e.currentTarget.value))} 
              />
            </Match>
          </Switch>
        </div>
        <Show when={props.description$}>
          <p class={`${description} ${props.disabled$ ? section__disabledDescription : ""}`}>
            {props.description$}
          </p>
        </Show>
      </div>
      {props.children}
    </section>
  )
}