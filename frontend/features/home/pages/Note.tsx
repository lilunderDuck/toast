import { For, Show } from "solid-js"
import { MdOutlineFilter_list_off } from 'solid-icons/md'
// ...
import { PlaceholderView, Spacer } from "~/components"
// ...
import { css } from "molcss"
import "../core/MainPageRoot.css"
import "~/styles/scrollbar.css"
// ...
import { CreateNoteButton, NoteBlock, TagListButton, TotalNotesText } from "../components"
import { useNoteHomeContext } from "../provider/NoteHomeProvider"

const section = css`
  overflow-y: auto;
  height: 100%;
  width: 100%;
  position: relative;
`

const section__header = css`
  padding-inline: 10px;
  padding-block: 5px;
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  user-select: none;
`

const section__list = css`
  height: 80vh;
`

const section__emptyNoteView = css`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
`

export default function Note() {
  const { resource$ } = useNoteHomeContext()

  return (
    <main class={`${section} journalHome__mainContent`}>
      <h1>Notes</h1>
      <header class={section__header}>
        <CreateNoteButton />
        <TagListButton />
        <Spacer />
        <TotalNotesText />
      </header>
      <Show when={!resource$.loading}>
        <Show when={resource$()!.length == 0} fallback={
          <div class={`${section__list} scrollbar scrollbarVertical`}>
            <For each={resource$()}>
              {/* @ts-ignore */}
              {it => <NoteBlock {...it} />}
            </For>
          </div>
        }>
          <PlaceholderView 
            icons$={<MdOutlineFilter_list_off size="4.5rem" />}
            class={section__emptyNoteView}
          >
            No notes here, try creating a new note.
          </PlaceholderView>
        </Show>
      </Show>
    </main>
  )
}