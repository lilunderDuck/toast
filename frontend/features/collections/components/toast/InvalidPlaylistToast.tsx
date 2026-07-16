import { css } from "molcss"
import { Button, toast } from "~/components"

const toast__root = css`
  padding-block: 5px;
  padding-inline: 10px;
  width: 21rem;
  border-radius: 6px;
  background-color: var(--base);
`

interface IInvalidPlaylistToastOptions {
  mode$: ""
  error$: string
  showHintDialog$: () => void
}

export default function InvalidPlaylistToast(options: IInvalidPlaylistToastOptions) {
  toast.custom$(() => (
    <div class={toast__root}>
      <h3>Invalid playlist</h3>
      <p class={css`margin-bottom: 5px;`}>
        {options.error$}
      </p>

      <Button onClick={options.showHintDialog$} variant$={ButtonVariant.SECONDARY}>
        What does this mean?
      </Button>
    </div>
  ), {
    position$: ToastPosition.BOTTOM_RIGHT
  })
}
