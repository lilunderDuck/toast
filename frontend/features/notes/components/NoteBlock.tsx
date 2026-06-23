import { BsPencilFill } from "solid-icons/bs"
// ...
import { css } from "molcss"
import './NoteBlock.css'
// ...
import { Button } from "~/components"
import { type group } from "~/wailsjs/go/models"
import { ASSETS_SERVER_URL } from "~/api"
import { createLazyComponent } from "~/hooks"
// ...
import { useNoteHomeContext } from "../provider"

const block = css`
  width: 100%;
  position: relative;
  display: flex;
  padding-inline: 10px;
  padding-block: 5px;
  gap: 10px;
  margin-bottom: 10px;
  border: 4px solid transparent;
  background-color: var(--mantle);
  border-radius: 6px;
  text-align: left;
  &:hover {
    border-color: var(--sapphire);
  }
`

const block__icon = css`
  width: 5rem;
  height: 5rem;
  flex-shrink: 0;
  border-radius: 6px;
`

const block__noIcon = css`
  background-color: var(--base);
`

const block__withIcon = css`
  background: center center no-repeat var(--img-url);
  background-size: cover;
`

const block__defaultBg = css`
  background-color: var(--mantle);
`

const block__editButton = css`
  position: "absolute";
  transition: "0.25s ease-out";
  right: 0;
  margin-top: 10;
  margin-right: 10;
`

const block__content = css`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const block__name = css`
`

const block__description = css`
  font-size: 14px;
  margin-bottom: 5px;
`

interface INoteBlockProps extends group.GroupData {
  // ...
}

export function NoteBlock(props: INoteBlockProps) {
  const { addGroup$, editGroup$ } = useNoteHomeContext()
  const NoteInfoDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("./dialog/NoteInfoDialog"),
    () => props
  )

  const EditNoteDialog = createLazyComponent(
    LazyComponentType.DIALOG,
    () => import("./dialog/editing/CreateOrEditNoteDialog"),
    () => ({
      prevData$: props,
      onSubmit$: (data) => addGroup$(data),
      // @ts-ignore
      onUpdate$: (data) => editGroup$(data.id, data)
    })
  )

  return (
    <button 
      class={block}
      id="block"
      data-block-has-icon={props.icon !== undefined && props.icon !== ""}
      style={{
        '--img-url': `url("${ASSETS_SERVER_URL}/local-assets/${props.id}/icons/${props.icon}")`
      }}
    >
      <div 
        class={`${block__icon} ${block__noIcon}`}
        id="block__icon" 
      />
      <div 
        class={block__content}
        onClick={NoteInfoDialog.show$}
      >
        <h2 class={block__name}>
          {props.name}
        </h2>
        <p class={block__description}>
          {props.description}
        </p>
      </div>

      <Button 
        class={block__editButton} 
        size$={ButtonSize.ICON} 
        id="block__editButton" 
        onClick={EditNoteDialog.show$}
      >
        <BsPencilFill />
      </Button>
      {/* ... */}
      <NoteInfoDialog.Component$ />
      <EditNoteDialog.Component$ />
    </button>
  )
}