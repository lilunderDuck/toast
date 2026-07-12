import { css } from "molcss"
import { toast } from "~/components"

const toast__root = css`
  padding-block: 5px;
  padding-inline: 10px;
  width: 18rem;
  border-radius: 6px;
  background-color: #b58f3e;
`

const toast__description = css`
  font-size: 14px;
`

export function showCollectionNotAvailableToast() {
  toast.custom$(() => (
    <div class={toast__root}>
      <h3>Collection is not avaliable</h3>
      <div class={toast__description}>
        Try reimporting the collection, or if you're saving your collection into another drive, please plug it in.
      </div>
    </div>
  ), {
    position: ToastPosition.BOTTOM_RIGHT
  })
}