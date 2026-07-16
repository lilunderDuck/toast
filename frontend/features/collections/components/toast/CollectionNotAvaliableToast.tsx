import { css } from "molcss"
import { toast } from "~/components"
import type { IBaseLazyToast } from "~/hooks"

const toast__root = css`
  padding-block: 5px;
  padding-inline: 10px;
  width: 21rem;
  border-radius: 6px;
  background-color: var(--surface0);
`

export default function showCollectionNotAvaliableToast(_: IBaseLazyToast) {
  toast.custom$(() => (
    <div class={toast__root}>
      <h3>Collection is not avaliable</h3>
      <p>
        Try reimporting the collection, or if you're saving your collection into another drive, please plug it in.
      </p>
    </div>
  ), {
    position$: ToastPosition.BOTTOM_RIGHT
  })
}