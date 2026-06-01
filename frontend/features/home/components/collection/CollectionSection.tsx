import type { ParentProps } from "solid-js"
import type { IconTypes } from "solid-icons"
import { CgSync } from "solid-icons/cg"
// ...
import { css } from "molcss"
import "~/styles/shorthand.css"
// ...
import { Button, Label, Spacer, Tooltip } from "~/components"

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

const section__tooltipDescription = css`
  color: var(--subtext0);
  font-size: 13px;
`

const section__itemList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 10rem;
`

export interface ICollectionSectionProps extends IActionHandler<CollectionSectionAction> {
  label$: string
  icon$: IconTypes
}

export function CollectionSection(props: ParentProps<ICollectionSectionProps>) {
  return (
    <section class="showOnHover">
      <div class={section__labelWrap}>
        <Label class={section__label}>
          <props.icon$ />
          {props.label$}
        </Label>
        <Spacer />
        <Tooltip label$={(
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
            class={"showOnHover__hide"}
            onClick={() => props.action$(CollectionSectionAction.RESYNC_COLLECTION)}
          >
            <CgSync />
          </Button>
        </Tooltip>
      </div>

      <div class={section__itemList}>
        {props.children}
      </div>
    </section>
  )
}