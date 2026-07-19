import { css } from "molcss"
import { Button, DialogContent } from "~/components"
import { FileDisplay, type FileTree } from "../file-display"
import type { IBaseLazyComponent } from "~/hooks"

export default function PlaylistErrorHintDialog(props: IBaseLazyComponent) {
  const FILE_TREE: FileTree[] = [
    {
      name$: "icons",
      description$: "contains track icon, playlist icon and playlist cover background image.",
      type$: "folder",
      children$: []
    },
    {
      name$: "track",
      description$: "stores the track mp3 files.",
      type$: "folder",
      children$: []
    },
    {
      name$: "meta.json",
      fileType$: "json",
      description$: "contains playlist metadata (name, track duration, ...)",
      type$: "file",
      children$: []
    },
  ]

  return (
    <DialogContent class={css`width: 42rem;`} showCloseButton$={false}>
      <h2>Playlist structure checklist</h2>

      <section>
        <p>Ensure that your imported playlist has at least one of the follow file/folder below:</p>
        <FileDisplay tree$={FILE_TREE}/>
      </section>

      <div class={css`display: flex; justify-content: flex-end; gap: 10px; padding-top: 10px;`}>
        <Button onClick={props.close$}>
          Close
        </Button>
      </div>
    </DialogContent>
  )
}