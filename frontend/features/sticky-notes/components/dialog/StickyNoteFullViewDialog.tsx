import { BsX } from "solid-icons/bs"
// ...
import { Button, DialogContent } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
import type { IActionHandler, IContextBridge } from "~/utils"
// ...
import { css } from "molcss"
// ...
import type { StickyNoteAction } from "../../provider/types"
import { StickyNoteTitle } from "../StickyNoteTitle"
import type { IStickyNoteBlockContext } from "../StickyNoteBlockProvider"

const dialog = css`
  position: relative;
  width: 55%;
`

const dialog__background = css`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0.25;
  background-color: var(--sticky-note-background-color);
  border-radius: 6px;
`

const dialog__button = css`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  flex-shrink: 0;
  padding: 0px;
  &:hover {
    background-color: var(--surface0);
  }
`

const dialog__someSpacesBellow = css`
  padding: 3px;
`

interface IStickyNoteFullViewDialogProps extends IBaseLazyComponent, IActionHandler<StickyNoteAction>, IContextBridge<IStickyNoteBlockContext> {
}

export default function StickyNoteFullViewDialog(props: IStickyNoteFullViewDialogProps) {
  return (
    <DialogContent
      class={dialog}
      style={`--sticky-note-background-color:${props.context$!.color$()}`}
      showCloseButton$={false}
    >
      <StickyNoteTitle 
        action$={props.action$}
        context$={props.context$}
        shouldShowOpenFullviewOptions$={false}
      >
        <button class={dialog__button} onClick={props.close$}>
          <BsX size={30} />
        </button>
      </StickyNoteTitle>
      <div class={dialog__someSpacesBellow} />
      {/* @ts-ignore */}
      <props.context$.ContentInput$ />

      <div class={dialog__background} />

      <div class={css`display: flex; justify-content: flex-end; gap: 10px;`}>
        <Button onClick={props.close$}>
          Close
        </Button>
      </div>
    </DialogContent>
  )
}