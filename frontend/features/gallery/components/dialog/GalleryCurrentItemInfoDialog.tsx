import { DEBUG_ASSERT } from "macro-def"
import { RiDesignAlignItemHorizontalCenterFill, RiSystemProgress1Fill } from "solid-icons/ri"
import { Show } from "solid-js"
// ...
import { css } from "molcss"
// ...
import { Button, DialogContent, Label } from "~/components"
import type { IBaseLazyComponent } from "~/hooks"
import type { gallery } from "~/wailsjs/go/models"

const dialog__content = css`
  width: 64%;
  user-select: none;
`

const dialog__infoSection = css`
  display: grid;
  grid-template-columns: minmax(100px, 1fr) 4fr;
  width: 100%;
  padding-bottom: 10px;
  padding-left: 10px;
  column-gap: 1.5rem;
  row-gap: 0.3rem;
`

const dialog__infoValue = css`
  word-break: break-word;
`

const dialog__progressSection = css`
  margin-top: 10px;
`

const dialog__progressWrap = css`
  width: 100%;
  height: 5px;
  border-radius: 6px;
  background-color: var(--surface0);
`

const dialog__progress = css`
  width: var(--gallery-current-progress);
  height: 5px;
  border-radius: 6px;
  background-color: var(--mauve);
`

const dialog__label = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-block: 5px;
`

interface IGalleryCurrentItemInfoDialogProps extends IBaseLazyComponent {
  currentItem$: gallery.GalleryItemData
  totalItems$: number
  currentItemIndex$: number
}

export default function GalleryCurrentItemInfoDialog(props: IGalleryCurrentItemInfoDialogProps) {
  DEBUG_ASSERT(props.currentItem$, "accessing currentItem$ too early!! (maybe there's some problem while loading)")

  const progressPercent = () => (props.currentItemIndex$ + 1) / props.totalItems$ * 100

  return (
    <DialogContent class={dialog__content} showCloseButton$={false}>
      <Label class={dialog__label}>
        <RiDesignAlignItemHorizontalCenterFill />
        Current item info
      </Label>
      <section class={dialog__infoSection}>
        <Show when={props.currentItem$.name}>
          <div>Name</div>
          <span>{props.currentItem$.name}</span>
        </Show>
        <Show when={props.currentItem$.description}>
          <div>Description</div>
          <p>{props.currentItem$.description}</p>
        </Show>
        <div>File name</div>
        <div class={dialog__infoValue}>
          <code>{props.currentItem$.fileName}</code>
        </div>
        <div>Item id</div>
        <div class={dialog__infoValue}>
          <code>{props.currentItem$.id}</code>
        </div>
      </section>
      
      <Label class={dialog__label}>
        <RiSystemProgress1Fill />
        Current progress
      </Label>
      <section class={dialog__progressSection}>
        <div class={dialog__progressWrap} style={`--gallery-current-progress:${progressPercent()}%`}>
          <div class={dialog__progress} />
        </div>
        <p>{props.currentItemIndex$ + 1} of {props.totalItems$} items ({Math.round(progressPercent())}%)</p>
      </section>

      <div class={css`display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px;`}>
        <Button variant$={ButtonVariant.SECONDARY} onClick={props.close$}>
          Close
        </Button>
      </div>
    </DialogContent>
  )
}