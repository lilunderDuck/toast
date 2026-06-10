import { css } from "molcss"

const toast = css`
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--base);
  width: 13rem;
  border-radius: 6px;
  margin-bottom: 10px;
  text-align: center;
`

interface IGalleryReduceModeToastProps {
  isInReduceMode$: boolean
}

export function GalleryReduceModeToast(props: IGalleryReduceModeToastProps) {
  return (
    <div class={toast}>
      {props.isInReduceMode$ ? "Entered reduce mode" : "Exited reduce mode"}
    </div>
  )
}