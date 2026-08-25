import { For, Show } from "solid-js"
import { BsFolder2Open } from "solid-icons/bs"
// ...
import { css } from "molcss"
// ...
import { Label, PlaceholderView } from "~/components"
// ...
import { useNoteHomeContext } from "../provider"
import { NoteGroupFolder } from "../components"

const list__emptyView = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

export function NoteList() {
  const { resource$ } = useNoteHomeContext()
  
  return (
    <Show when={!resource$.loading}>
      <Label>
        Folders
      </Label>
      <Show when={resource$()!.length == 0} fallback={
        <For each={resource$()}>
          {it => <NoteGroupFolder {...it} />}
        </For>
      }>
        <PlaceholderView
          icons$={<BsFolder2Open size="4.5rem" />}
          class={list__emptyView}
        >
          There is notes here, try creating a new note?
        </PlaceholderView>
      </Show>
    </Show>
  )
}