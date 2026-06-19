import { css } from "molcss"
import { toast } from "~/components"

const toast__root = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--base);
  width: 13rem;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
`

export function showGalleryReduceModeToast(isAllControlHidden: boolean) {
  const reducedModeToast = () => isAllControlHidden ? (
    <div class={toast__root}>
      Entered reduce mode
    </div>
  ) : (
    <div class={toast__root}>
      Exited reduce mode
    </div>
  )

  toast.custom(reducedModeToast, {
    position: ToastPosition.BOTTOM_CENTER
  })
}