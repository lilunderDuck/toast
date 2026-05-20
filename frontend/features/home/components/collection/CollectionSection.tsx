import type { ParentProps } from "solid-js"
import type { IconTypes } from "solid-icons"
// ...
import stylex from "@stylexjs/stylex"
import "~/styles/shorthand.css"
// ...
import { Button, Label, Spacer, Tooltip } from "~/components"
import { CgSync } from "solid-icons/cg"

const style = stylex.create({
  section__labelWrap: {
    width: "100%",
    paddingInline: 5,
    paddingBlock: 10,
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  section__label: {
    display: "flex",
    alignItems: "center",
    gap: 10
  },
  section__tooltipDescription: {
    color: "var(--subtext0)",
    fontSize: 13
  }
})

type Action = "resync_collection$"

export interface ICollectionSectionProps extends IActionHandler<Action> {
  label$: string
  icon$: IconTypes
}

export function CollectionSection(props: ParentProps<ICollectionSectionProps>) {
  return (
    <section class={`showOnHover`}>
      <div {...stylex.attrs(style.section__labelWrap)}>
        <Label {...stylex.attrs(style.section__label)}>
          <props.icon$ />
          {props.label$}
        </Label>
        <Spacer />
        <Tooltip label$={(
          <>
            Resync {props.label$.toLowerCase()}.
            <br />
            <span {...stylex.attrs(style.section__tooltipDescription)}>
              In case you have missing collection or <br />
              you just added a new collection.
            </span>
          </>
        )}>
          <Button 
            size$={ButtonSize.ICON} 
            variant$={ButtonVariant.NO_BACKGROUND}
            class={"showOnHover__hide"}
            onClick={() => props.action$("resync_collection$")}
          >
            <CgSync />
          </Button>
        </Tooltip>
      </div>

      {props.children}
    </section>
  )
}