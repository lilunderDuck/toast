import type { ParentProps } from "solid-js"
import { CLS } from "macro-def"
import { BsThreeDots } from "solid-icons/bs"
// ...
import { HoveredHexColorInput } from "~/components"
import type { IContextBridge } from "~/utils"
import { createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import stylex from "@stylexjs/stylex"
// ...
import type { StickyNoteAction } from "./types"
import { useStickyNoteContext, type IStickyNoteContext } from "./StickyNoteProvider"

const style = stylex.create({
  block__buttonRow: {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
  block__button: {
    width: 30,
    height: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    padding: 0,
    ":hover": {
      backgroundColor: "var(--surface0)"
    }
  },
  block__header: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5
  }
})

export interface IStickyNoteTitleProps extends IActionHandler<StickyNoteAction>, IContextBridge<IStickyNoteContext> {
  shouldShowOpenFullviewOptions$?: boolean
}

export function StickyNoteTitle(props: ParentProps<IStickyNoteTitleProps>) {
  const { 
    color$,
    setColor$,
    setButtonRowShouldAlwaysShow$,
    TitleInput$,
  } = useStickyNoteContext() ?? props.context$!

  const { DropdownMenu$ } = createLazyLoadedDropdownMenu(
    () => import("../dropdown/StickyNoteMoreOptionDropdown"),
    () => ({
      action$: props.action$,
      shouldShowOpenFullviewOptions$: props.shouldShowOpenFullviewOptions$
    })
  )

  return (
    <h3 {...stylex.attrs(style.block__header)}>
      <TitleInput$ />
      <div class={`${CLS(style.block__buttonRow)} showOnHover__hide`}>
        <DropdownMenu$ onOpen$={setButtonRowShouldAlwaysShow$}>
          <button {...stylex.attrs(style.block__button)}>
            <BsThreeDots />
          </button>
        </DropdownMenu$>
        <HoveredHexColorInput
          color$={color$}
          setColor$={setColor$}
          onReset$={() => {}}
          onOpen$={setButtonRowShouldAlwaysShow$}
        />
        {props.children}
      </div>
    </h3>
  )
}