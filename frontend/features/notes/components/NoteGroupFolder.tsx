import { css } from "molcss"
import { BsThreeDots } from "solid-icons/bs"
import type { note } from "~/wailsjs/go/models"
import "./NoteGroupFolder.css"
import { createLazyComponent } from "~/hooks"

const note__root = css`
  width: 15rem;
  border-radius: 6px;
  user-select: none;
`

const note__background = css`
  position: relative;
  width: 15rem;
  height: 4.75rem;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
`

const note__hasBackground = css`
  background: center center no-repeat var(--note-group-background-url);
  background-size: cover;
`

const note__noBackground = css`
  background-color: var(--mantle);
`

const note__folderLabelThingyIdk = css`
  position: absolute;
  bottom: 0;
  width: 8.75rem;
  height: 1.5rem;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
  background-color: var(--surface0);
`

const note__moreOptionsButton = css`
  position: absolute;
  bottom: 0;
  right: 0;
  margin-right: 10px;
  margin-bottom: 5px;
  padding-inline: 10px;
  padding-block: 5px;
  background-color: var(--surface0);
  color: var(--subtext0);
  &:hover {
    background-color: var(--surface1);
    color: var(--text);
  }
`

const note__content = css`
  width: 15rem;
  height: 6rem;
  background-color: var(--surface0);
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  padding-inline: 10px;
  padding-block: 5px;
`

const note__description = css`
  font-size: 14px;
`

interface INoteGroupFolderProps extends note.NoteGroup { }

export function NoteGroupFolder(props: INoteGroupFolderProps) {
  const NoteGroupFolderDropdownMenu = createLazyComponent(
    LazyComponentType.DROPDOWN_MENU,
    () => import("./dropdown/NoteGroupFolderDropdownMenu"),
    () => ({
      imageSrc$: props.icon
    })
  )

  return (
    <div class={`${note__root} note_root`} style={`--note-group-background-url:url('${props.icon}')`}>
      <div class={`${note__background} ${props.icon ? note__hasBackground : note__noBackground}`}>
        <div class={note__folderLabelThingyIdk} />
        <button class={note__moreOptionsButton} id="note__moreOptionsButton">
          <NoteGroupFolderDropdownMenu.Component$>
            <BsThreeDots />
          </NoteGroupFolderDropdownMenu.Component$>
        </button>
      </div>
      <div class={note__content}>
        <h3>{props.name}</h3>
        <p class={note__description}>
          {props.description}
        </p>
      </div>
    </div>
  )
}