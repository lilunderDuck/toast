import { For, Match, Show, Switch } from "solid-js"
import { MdOutlineFilter_list_off } from 'solid-icons/md'
// ...
import { Input, PlaceholderView, Spacer } from "~/components"
import { scrollbar, scrollbar__vertical } from "~/styles"
// ...
import { css } from "molcss"
// ...
import { useNoteHomeContext } from "../provider"
import { CreateNoteButton, TagListButton, TotalNotesText } from "../components"

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
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  user-select: none;
  & > div {
    flex-shrink: 0;
  }
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

export default function NotePage() {
  const { resource$, view$ } = useNoteHomeContext()

  return (
    <main class={`${section} journalHome__mainContent`}>
      <h1>Notes</h1>
      <header class={section__header}>
        <CreateNoteButton />
        <TagListButton />
        <Spacer />
        <Input placeholder="Search notes" />
        <TotalNotesText />
      </header>
      <div class={`${section__list} ${scrollbar} ${scrollbar__vertical}`}>
        <Switch>
          <Match when={view$() === NotePageViewType.NOTE}>
            <Show when={!resource$.loading}>
              <Show when={resource$()!.length == 0} fallback={
                <For each={resource$()}>
                  {/* @ts-ignore */}
                  {it => <NoteBlock {...it} />}
                </For>
              }>
                <PlaceholderView
                  icons$={<MdOutlineFilter_list_off size="4.5rem" />}
                  class={section__emptyNoteView}
                >
                  No notes here, try creating a new note.
                </PlaceholderView>
              </Show>
            </Show>
          </Match>

          <Match when={view$() === NotePageViewType.DAILY}>
            <></>
          </Match>
        </Switch>
      </div>
    </main>
  )
}