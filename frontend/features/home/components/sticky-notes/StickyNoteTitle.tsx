import type { ParentProps } from "solid-js"
import { BsThreeDots } from "solid-icons/bs"
// ...
import { HoveredHexColorInput } from "~/components"
import type { IContextBridge } from "~/utils"
import { createLazyLoadedDropdownMenu } from "~/hooks"
// ...
import { css } from "molcss"
// ...
import type { StickyNoteAction } from "./types"
import { useStickyNoteContext, type IStickyNoteContext } from "./StickyNoteProvider"

const block__buttonRow = css`
  display: flex;
  align-items: center;
  gap: 5px;
`

const block__button = css`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  padding: 0;
  &:hover {
    background-color: var(--surface0);
  }
`

const block__header = css`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

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
    <h3 class={block__header}>
      <TitleInput$ />
      <div class={`${block__buttonRow} showOnHover__hide`}>
        <DropdownMenu$ onOpen$={setButtonRowShouldAlwaysShow$}>
          <button class={block__button}>
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