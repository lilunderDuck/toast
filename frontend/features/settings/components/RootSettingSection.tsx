import { type JSX, Show } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Input } from "~/components"
import type { HTMLAttributes } from "~/utils"
// ...
import type { ISettingSectionProps } from "../provider"

const setting__thisThing = css`
  margin-top: 15px;
  &:first-child {
    margin-top: 0;
  }
`

const setting__name = css`
  display: flex;
  align-items: center;
`

const setting__nameDisabled = css`
  color: var(--crust0);
`

const setting__description = css`
  font-size: 14px;
  color: var(--subtext0);
  padding-right: 2rem;
  word-break: break-all;
`

const setting__descriptionDisabled = css`
  color: var(--gray9);
`

const setting__input = css`
  width: 8rem;
  padding-block: 5px;
`

export function RootSettingSection(props: HTMLAttributes<"section">) {
  return (
    <section {...props} class={setting__thisThing} />
  )
}

export function RootSettingName(props: ISettingSectionProps<any> & {
  inline$?: JSX.Element
}) {
  return (
    <h4 class={`${setting__name} ${props.disabled$ ? setting__nameDisabled : ''}`}>
      {props.name$}
      {props.inline$}
    </h4>
  )
}

export function RootSettingDescription(props: Pick<ISettingSectionProps<any>, "description$" | "disabled$">) {
  return (
    <Show when={props.description$}>
      <p class={`${setting__description} ${props.disabled$ ? setting__descriptionDisabled : ''}`}>
        {props.description$}
      </p>
    </Show>
  )
}

export function RootSettingInput(props: HTMLAttributes<"input">) {
  return (
    <Input 
      {...props}
      class={props.type !== "range" ? setting__input : ''}
    />
  )
}