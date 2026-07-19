import { Show, type JSX, type ParentProps } from "solid-js"
import type { IconTypes } from "solid-icons"
import { BsInfoCircleFill } from "solid-icons/bs"
// ...
import { css } from "molcss"
import "~/styles/shorthand.css"
// ...
import { Label, Spacer, Tooltip } from "~/components"

const section__labelWrap = css`
  width: 100%;
  padding-inline: 5px;
  padding-block: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`

const section__label = css`
  display: flex;
  align-items: center;
  gap: 10px;
`

const section__itemList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 10rem;
`

const section__labelTool = css`
  display: flex;
  align-items: center;
  gap: 10;
`

export interface ICollectionSectionProps {
  label$: string
  icon$: IconTypes
  description$?: JSX.Element
  labelTools$?: JSX.Element
  class$?: string
}

export function CollectionSection(props: ParentProps<ICollectionSectionProps>) {
  return (
    <section class={`showOnHover ${props.class$ ?? ''}`}>
      <div class={section__labelWrap}>
        <Show when={props.description$} fallback={
          <Label class={section__label}>
            <props.icon$ />
            {props.label$}
          </Label>
        }>
          <Label class={section__label}>
            <props.icon$ />
            {props.label$}

            <Tooltip label$={props.description$}>
              <BsInfoCircleFill class="showOnHover__hide" />
            </Tooltip>
          </Label>
        </Show>
        <Spacer />
        <div class={`showOnHover__hide ${section__labelTool}`}>
          {props.labelTools$}
        </div>
      </div>

      <div class={section__itemList}>
        {props.children}
      </div>
    </section>
  )
}