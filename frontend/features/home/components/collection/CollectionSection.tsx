import { For, Show, type JSX, type ParentProps } from "solid-js"
import type { IconTypes } from "solid-icons"
import { BsInfoCircleFill } from "solid-icons/bs"
// ...
import { css } from "molcss"
import "~/styles/shorthand.css"
// ...
import { Label, Spacer, Tooltip } from "~/components"
import type { IActionHandler } from "~/utils"
import type { collections } from "~/wailsjs/go/models"

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

// const section__tooltipDescription = css`
//   color: var(--subtext0);
//   font-size: 13px;
// `

const section__itemList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 10rem;
`

export interface ICollectionSectionProps extends IActionHandler<CollectionSectionAction> {
  label$: string
  icon$: IconTypes
  description$?: JSX.Element
}

export function CollectionSection(props: ParentProps<ICollectionSectionProps>) {
  return (
    <section class="showOnHover">
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
        {/* <Tooltip label$={(
          <>
            Resync {props.label$.toLowerCase()}.
            <br />
            <span class={section__tooltipDescription}>
              In case you have missing collection or <br />
              you just added a new collection.
            </span>
          </>
        )}>
          <Button
            size$={ButtonSize.ICON}
            variant$={ButtonVariant.NO_BACKGROUND}
            class="showOnHover__hide"
            onClick={() => props.action$(CollectionSectionAction.RESYNC_COLLECTION)}
          >
            <CgSync />
          </Button>
        </Tooltip> */}
      </div>

      <div class={section__itemList}>
        {props.children}
      </div>
    </section>
  )
}