import type { ParentProps } from "solid-js"
import { BsThreeDots } from "solid-icons/bs"
// ...
import { HoveredHexColorInput } from "~/components"
import type { IActionHandler, IContextBridge } from "~/utils"
import { createLazyComponent } from "~/hooks"
// ...
import { css } from "molcss"
// ...
import type { StickyNoteAction } from "../provider/types"
import { useStickyNoteBlockContext, type IStickyNoteBlockContext } from "./StickyNoteBlockProvider"

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

export interface IStickyNoteTitleProps extends IActionHandler<StickyNoteAction>, IContextBridge<IStickyNoteBlockContext> {
  shouldShowOpenFullviewOptions$?: boolean
}

export function StickyNoteTitle(props: ParentProps<IStickyNoteTitleProps>) {
  const { 
    color$,
    setColor$,
    setButtonRowShouldAlwaysShow$,
    TitleInput$,
  } = useStickyNoteBlockContext() ?? props.context$!

  const StickyNoteMoreOptionDropdown = createLazyComponent(
    LazyComponentType.DROPDOWN_MENU,
    () => import("./dropdown/StickyNoteMoreOptionDropdown"),
    () => ({
      action$: props.action$,
      shouldShowOpenFullviewOptions$: props.shouldShowOpenFullviewOptions$
    })
  )

  return (
    <h3 class={block__header}>
      <TitleInput$ />
      <div class={`${block__buttonRow} showOnHover__hide`}>
        <StickyNoteMoreOptionDropdown.Component$ onOpen$={setButtonRowShouldAlwaysShow$}>
          <button class={block__button}>
            <BsThreeDots />
          </button>
        </StickyNoteMoreOptionDropdown.Component$>
        <HoveredHexColorInput
          color$={color$}
          setColor$={setColor$}
          onOpen$={setButtonRowShouldAlwaysShow$}
        />
        {props.children}
      </div>
    </h3>
  )
}